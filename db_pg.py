import psycopg2, os
def get_conn():
    return psycopg2.connect(
        host=os.getenv("PGHOST","localhost"),
        database=os.getenv("PGDATABASE","nlp_gateway"),
        user=os.getenv("PGUSER","postgres"),
        password=os.getenv("PGPASSWORD","postgres")
    )
