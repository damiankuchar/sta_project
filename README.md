# How to run development env

### The project does not include seeding of database data

## Packages (required to have)
- `django`
- `django-compressor`
- `Pillow`

### Open first terminal and run
- `cd sta_project`
- `python manage.py migrate` (run migrations)
- `python manage.py runserver`

### Open second terminal and run
- `cd sta_project/sta_project`
- `npx tailwindcss -i ./static/src/input.css -o ./static/src/output.css --watch`

Have fun!