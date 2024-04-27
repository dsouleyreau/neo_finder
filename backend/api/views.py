import os
from rest_framework.views import APIView
from rest_framework import status
import requests
from datetime import datetime, timedelta
from django.utils import timezone
from django.db.models import Min
from django.db import transaction
from django.http import JsonResponse
from .models import Asteroid, Approach

class Asteroids(APIView):
    def get(self, request):
        # Obtain start date, end date, and API key from request
        start_date_str = request.GET.get('start_date')
        end_date_str = request.GET.get('end_date')
        api_key = os.environ.get('API_KEY')

        # Convert start date and end date strings to datetime objects
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()

        # Find periods where approaches are not already populated between start_date and end_date
        periods_to_populate = self.find_periods_to_populate(start_date, end_date)

        # Cache data for each period
        for period in periods_to_populate:
            self.cache_data(period[0], period[1], api_key)

        # Return all approaches between start_date and end_date
        approaches = self.get_approaches(start_date, end_date)

        return JsonResponse(approaches, safe=False)

    def find_periods_to_populate(self, start_date, end_date):
        # Find the minimum approach date in the database between start_date and end_date
        min_approach_date = Approach.objects.filter(date__range=[start_date, end_date]).aggregate(Min('date'))['date__min']

        if min_approach_date is None:
            # If no approaches are present in the specified date range, start from start_date
            min_approach_date = start_date

        # Calculate start and end dates for periods to populate
        periods_to_populate = []
        current_date = end_date
        while current_date >= min_approach_date:
            end_period = current_date
            start_period = current_date - timedelta(days=6)
            if not Approach.objects.filter(date__range=[start_period, end_period]).exists():
                periods_to_populate.append((start_period, end_period))
            current_date -= timedelta(days=7)

        return periods_to_populate

    def get_approaches(self, start_date, end_date):
        approaches = Approach.objects.filter(date__range=[start_date, end_date])

        # Serialize asteroids by approach
        serialized_approaches = {}
        for approach in approaches:
            date = approach.date.strftime('%Y/%m/%d')
            if not serialized_approaches.get(date):
                serialized_approaches[date] = {
                    'date': date,
                    'distance': approach.distance,
                    'asteroids': []
                }
            serialized_approaches[date]['asteroids'].append({
                'name': approach.asteroid.name,
                'size': approach.asteroid.size,
                'distance': approach.asteroid.distance,
                'danger': approach.asteroid.danger,
                'approaches': [{ 'date': _approach.date, 'distance': _approach.distance } for _approach in approach.asteroid.approach_set.all()]
            })

        return list(serialized_approaches.values())

    def cache_data(self, start_date, end_date, api_key):
        url = f"https://api.nasa.gov/neo/rest/v1/feed?start_date={start_date}&end_date={end_date}&api_key={api_key}"
        
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            neo_data = data['near_earth_objects']
            
            # Cache data in the database in one atomic transaction
            with transaction.atomic():
                for asteroids in neo_data.values():
                    for asteroid_data in asteroids:

                        # Calculate estimated size, minimum distance,
                        estimated_size = (asteroid_data['estimated_diameter']['kilometers']['estimated_diameter_min'] + asteroid_data['estimated_diameter']['kilometers']['estimated_diameter_max']) / 2
                        min_distance = float('inf')

                        # Get approaches' minimum distance 
                        approaches = []
                        for approach_data in asteroid_data['close_approach_data']:
                            distance = float(approach_data['miss_distance']['kilometers'])
                            date = datetime.fromtimestamp(approach_data['epoch_date_close_approach'] / 1000)
                            if distance < min_distance:
                                min_distance = distance

                            approaches.append((date, distance))
                        
                        # Cache asteroid data
                        asteroid, _ = Asteroid.objects.get_or_create(name=asteroid_data['name'], size=estimated_size, distance=min_distance, danger=asteroid_data['is_potentially_hazardous_asteroid'])

                        # Cache approach data
                        for approach in approaches:
                            approach, _ = Approach.objects.get_or_create(date=approach[0], distance=approach[1], asteroid=asteroid)
