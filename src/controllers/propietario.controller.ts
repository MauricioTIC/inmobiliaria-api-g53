import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere, repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import fetch from 'cross-fetch';
import {Propietario} from '../models';
import {PropietarioRepository} from '../repositories';
import {AutenticacionService} from '../services/autenticacion.service';

export class PropietarioController {
  constructor(
    @repository(PropietarioRepository)
    public propietarioRepository: PropietarioRepository,

    @service(AutenticacionService)
    public autententicacionService: AutenticacionService
  ) {

  }

  @post('/validar-acceso')
  @response(200, {
    description: 'Validar las crendeciales del usuario',
  })
  async validarAcceso() {
    return 'Se va a validar el acceso';
  }





  @post('/propietarios')
  @response(200, {
    description: 'Propietario model instance',
    content: {'application/json': {schema: getModelSchemaRef(Propietario)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Propietario, {
            title: 'NewPropietario',
            exclude: ['id'],
          }),
        },
      },
    })
    propietario: Omit<Propietario, 'id'>,
  ): Promise<Propietario> {
    //ESta acción es mientras generamos el front y desde el fron la clave ya debe encriptada
    //let prop = this.autententicacionService.cifrarClave(propietario.clave);

    let prop = await this.propietarioRepository.create(propietario);

    let notificacion = {
      correo: prop.correo,
      asunto: 'Inmobilida MINTIC - Proceso de inscripción',
      mensaje: 'Bienvenido a la inmobiliaria MINTIC 2022'
    }

    let url_servicio_correo = 'http://localhost:5000/enviar-correo?';

    // enviar la notificacion por email al propietario con sus credenciales
    fetch(`${url_servicio_correo}correo=${notificacion.correo}&asunto=${notificacion.asunto}&mensaje=${notificacion.mensaje}`)
      .then((response) => console.log(`Notificación enviada: ${prop.correo}`));

    return prop;
  }

  @get('/propietarios/count')
  @response(200, {
    description: 'Propietario model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Propietario) where?: Where<Propietario>,
  ): Promise<Count> {
    return this.propietarioRepository.count(where);
  }

  @get('/propietarios')
  @response(200, {
    description: 'Array of Propietario model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Propietario, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Propietario) filter?: Filter<Propietario>,
  ): Promise<Propietario[]> {
    return this.propietarioRepository.find(filter);
  }

  @patch('/propietarios')
  @response(200, {
    description: 'Propietario PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Propietario, {partial: true}),
        },
      },
    })
    propietario: Propietario,
    @param.where(Propietario) where?: Where<Propietario>,
  ): Promise<Count> {
    return this.propietarioRepository.updateAll(propietario, where);
  }

  @get('/propietarios/{id}')
  @response(200, {
    description: 'Propietario model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Propietario, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Propietario, {exclude: 'where'}) filter?: FilterExcludingWhere<Propietario>
  ): Promise<Propietario> {
    return this.propietarioRepository.findById(id, filter);
  }

  @patch('/propietarios/{id}')
  @response(204, {
    description: 'Propietario PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Propietario, {partial: true}),
        },
      },
    })
    propietario: Propietario,
  ): Promise<void> {
    await this.propietarioRepository.updateById(id, propietario);
  }

  @put('/propietarios/{id}')
  @response(204, {
    description: 'Propietario PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() propietario: Propietario,
  ): Promise<void> {
    await this.propietarioRepository.replaceById(id, propietario);
  }

  @del('/propietarios/{id}')
  @response(204, {
    description: 'Propietario DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.propietarioRepository.deleteById(id);
  }
}
