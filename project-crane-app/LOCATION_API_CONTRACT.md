# Location and Routes Backend Contract

The mobile app no longer calls Google Directions, Places or Geocoding web
services directly. The backend owns Google server-side API keys, quotas,
field masks, caching and provider fallback.

All endpoints live under `/api/v1/mobile` and use the existing envelope:

```json
{
  "success": true,
  "message": "OK",
  "data": {},
  "meta": null,
  "errors": null
}
```

## GET /locations/autocomplete

Query:

- `input`: user typed address.
- `session_token`: stable token for one autocomplete session.
- `region_code`: defaults to `DO`.
- `lat` / `lng`: optional map or user location bias.

Backend behavior:

- Use Places API Autocomplete (New).
- Send the same `session_token` through prediction and place details.
- Bias to Dominican Republic with `regionCode=DO`, `includedRegionCodes=["DO"]`
  and `locationBias` when `lat`/`lng` are present.
- Return up to 5 predictions.

Response `data`:

```json
[
  {
    "id": "prediction-id",
    "place_id": "places/ChIJ...",
    "description": "Av. Winston Churchill, Santo Domingo",
    "main_text": "Av. Winston Churchill",
    "secondary_text": "Santo Domingo, República Dominicana",
    "source": "places"
  }
]
```

## GET /locations/place-details

Query:

- `place_id`
- `session_token`

Backend behavior:

- Use Places Details (New) or compatible Google endpoint.
- Request only required fields: id, formatted address, location, address
  components needed for country.

Response `data`:

```json
{
  "place_id": "places/ChIJ...",
  "address": "Av. Winston Churchill, Santo Domingo",
  "latitude": 18.4861,
  "longitude": -69.9312,
  "country": "República Dominicana"
}
```

## GET /locations/reverse-geocode

Query:

- `lat`
- `lng`

Backend behavior:

- Use Geocoding API or equivalent backend provider.
- Cache allowed values per Google Maps Platform terms and isolate user-specific
  cached data where required.

Response `data`:

```json
{
  "address": "Av. Abraham Lincoln, Santo Domingo",
  "latitude": 18.4861,
  "longitude": -69.9312,
  "country": "República Dominicana"
}
```

## POST /routes/compute

Payload:

```json
{
  "service_type": "taxi",
  "origin": { "lat": 18.4861, "lng": -69.9312 },
  "destination": { "lat": 18.5, "lng": -69.96 },
  "travel_mode": "DRIVE",
  "region_code": "DO"
}
```

Backend behavior:

- Use Routes API `https://routes.googleapis.com/directions/v2:computeRoutes`.
- Use `X-Goog-FieldMask` with only required fields, for example:
  `routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline`.
- Do not use `*` field masks in production.
- Return route geometry in either decoded coordinates or encoded polyline.
- If the same route values are cached, respect Google Maps Platform caching
  limits.

Response `data`:

```json
{
  "provider": "google_routes",
  "distance_meters": 6200,
  "duration_seconds": 840,
  "polyline": "encoded_polyline",
  "coordinates": [
    [-69.9312, 18.4861],
    [-69.96, 18.5]
  ]
}
```

The mobile app accepts either `coordinates` as `[lng, lat]` pairs or an encoded
polyline.
