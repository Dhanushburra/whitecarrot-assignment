# Generated manually for removing is_active field
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0003_make_description_optional'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='job',
            name='is_active',
        ),
    ]

