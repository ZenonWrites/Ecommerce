from django.db import migrations

def create_superuser(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser(
            username='adminpostgre',
            email='admin@example.com',
            password='adminpassword123'
        )

class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_alter_category_options_alter_product_options'),
    ]

    operations = [
        migrations.RunPython(create_superuser),
    ]
