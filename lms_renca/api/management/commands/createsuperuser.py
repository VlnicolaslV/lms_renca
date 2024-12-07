from django.contrib.auth.management.commands.createsuperuser import Command as SuperUserCommand
from django.core.management import CommandError
from django.db.utils import IntegrityError

class Command(SuperUserCommand):
    help = 'Crea un superusuario con un RUT específico'

    def add_arguments(self, parser):
        super().add_arguments(parser)
        parser.add_argument('--rut', type=str, help='RUT del superusuario')

    def handle(self, *args, **options):
        rut = options.get('rut')
        if not rut:
            raise CommandError("Debes proporcionar un valor para el RUT usando el argumento --rut")
        
        # Verifica si ya existe un usuario con ese RUT
        from api.models import Usuario
        if Usuario.objects.filter(rut=rut).exists():
            raise CommandError("Ya existe un usuario con ese RUT")
        
        # Llama al método de creación de superusuario predeterminado
        try:
            super().handle(*args, **options)
            # Asigna el RUT después de la creación
            usuario = Usuario.objects.get(username=options.get('username'))
            usuario.rut = rut
            usuario.save()
            self.stdout.write(self.style.SUCCESS(f'Superusuario creado con RUT: {rut}'))
        except IntegrityError:
            raise CommandError("No se pudo crear el superusuario debido a un problema de integridad en la base de datos.")
