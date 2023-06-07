# cd app/infrastructure/database/migrations
# alembic upgrade head
# cd ../../../../

gunicorn app.main:app \
     --bind 0.0.0.0:4000 \
     --threads 4 \
     --workers 4 \
     --worker-class uvicorn.workers.UvicornWorker \
     --timeout 45 \
     --access-logfile - \
     --error-logfile -
