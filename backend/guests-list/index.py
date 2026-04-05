import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Получение списка гостей, подтвердивших присутствие на свадьбе."""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute('SELECT email, created_at FROM guests ORDER BY created_at DESC')
    rows = cur.fetchall()
    cur.close()
    conn.close()

    guests = [
        {'email': row[0], 'created_at': row[1].strftime('%d.%m.%Y %H:%M')}
        for row in rows
    ]

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'guests': guests, 'total': len(guests)})
    }
