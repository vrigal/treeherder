# Generated by Django 3.0.8 on 2020-12-11 14:42

from django.db import migrations
from django.conf import settings

MULTICOMMIT_CONSTRAINT_SYMBOL = 'perf_multicommitdatu_perf_datum_id_c2d7eb14_fk_performan'

if settings.DATABASES['default']['ENGINE'] == 'django.db.backends.mysql':
    DROP_TYPE = 'FOREIGN_KEY'
else:
    DROP_TYPE = 'CONSTRAINT'


class Migration(migrations.Migration):
    dependencies = [
        ('perf', '0035_fix_deprecated_nullboolean_field'),
    ]

    operations = [
        migrations.RunSQL(
            # add ON DELETE CASCADE at database level
            [
                f'ALTER TABLE perf_multicommitdatum '
                f'DROP {DROP_TYPE} {MULTICOMMIT_CONSTRAINT_SYMBOL};',
                f'ALTER TABLE perf_multicommitdatum '
                f'ADD CONSTRAINT {MULTICOMMIT_CONSTRAINT_SYMBOL} '
                f'FOREIGN KEY (perf_datum_id) REFERENCES performance_datum (ID) ON DELETE CASCADE;',
            ],
            # put back the non-CASCADE foreign key constraint
            reverse_sql=[
                f'ALTER TABLE perf_multicommitdatum '
                f'DROP {DROP_TYPE} {MULTICOMMIT_CONSTRAINT_SYMBOL};',
                f'ALTER TABLE perf_multicommitdatum '
                f'ADD CONSTRAINT {MULTICOMMIT_CONSTRAINT_SYMBOL} '
                f'FOREIGN KEY (perf_datum_id) REFERENCES performance_datum (ID);',
            ],
        )
    ]
