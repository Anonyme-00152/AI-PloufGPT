import sqlite3
import os
from datetime import datetime, timedelta
import uuid

# Sur Vercel, le seul répertoire scriptable est /tmp
if os.environ.get('VERCEL'):
    DB_PATH = '/tmp/database.db'
else:
    DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'database.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS keys (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key_value TEXT UNIQUE NOT NULL,
            plan_type TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            expires_at DATETIME,
            is_active INTEGER DEFAULT 1
        )
    ''')
    conn.commit()
    conn.close()

def generate_key(plan_type):
    key_value = f"DARK-{uuid.uuid4().hex[:8].upper()}-{plan_type[:3].upper()}"
    
    expires_at = None
    if plan_type == "Premium":
        expires_at = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d %H:%M:%S')
    elif plan_type == "Trimestriel":
        expires_at = (datetime.now() + timedelta(days=90)).strftime('%Y-%m-%d %H:%M:%S')
    elif plan_type == "Permanent":
        expires_at = None # Pas d'expiration
        
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('INSERT INTO keys (key_value, plan_type, expires_at) VALUES (?, ?, ?)', 
                   (key_value, plan_type, expires_at))
    conn.commit()
    conn.close()
    return key_value

def validate_key(key_value):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT expires_at, is_active FROM keys WHERE key_value = ?', (key_value,))
    result = cursor.fetchone()
    conn.close()
    
    if not result:
        return False, "Clé invalide"
    
    expires_at, is_active = result
    
    if not is_active:
        return False, "Clé désactivée"
    
    if expires_at:
        expiry_date = datetime.strptime(expires_at, '%Y-%m-%d %H:%M:%S')
        if datetime.now() > expiry_date:
            return False, "Clé expirée"
            
    return True, "Clé valide"

def get_all_keys():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT key_value, plan_type, created_at, expires_at, is_active FROM keys ORDER BY created_at DESC')
    keys = cursor.fetchall()
    conn.close()
    return keys

def delete_key(key_value):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('DELETE FROM keys WHERE key_value = ?', (key_value,))
    conn.commit()
    conn.close()

# Initialiser la base de données au chargement du module
init_db()
