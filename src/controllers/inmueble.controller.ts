import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Inmueble} from '../models';
import {InmuebleRepository} from '../repositories';
import {InmuebleService} from '../services/inmueble.service';

@authenticate("admin")
export class InmuebleController {
  constructor(
    @repository(InmuebleRepository)
    public inmuebleRepository: InmuebleRepository,
    @service(InmuebleService)
    public inmuebleService: InmuebleService
  ) { }

  // consultar los la lista de inmuebles en estado . 'A'
  @authenticate.skip()
  @get('/inmuebles-disponibles')
  @response(200, {
    description: 'Consulta la lista de inmuebles disponibles',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Inmueble, {includeRelations: true}),
        },
      },
    },
  })
  async inmueblesDisponiblesParaArriendo() {
    return this.inmuebleService.getInmueblesDisponibles();
  }

  @authenticate.skip()
  @get('/inmuebles-precio-mayor-a/{valor}')
  @response(200, {
    description: 'Consulta la lista de inmuebles con un precio mayor A $$$$',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Inmueble, {includeRelations: true}),
        },
      },
    },
  })
  async inmueblesConPrecioMayorA(
    @param.path.number('valor') valor: number
  ) {
    return this.inmuebleService.getInmueblesPorPrecioMayorA(valor);
  }

  @authenticate.skip()
  @get('/inmuebles-precio-menor-a/{valor}')
  @response(200, {
    description: 'Consulta la lista de inmuebles con un precio menor A $$$$',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Inmueble, {includeRelations: true}),
        },
      },
    },
  })
  async inmueblesConPrecioMenorA(
    @param.path.number('valor') valor: number
  ) {
    return this.inmuebleService.getInmueblesPorPrecioMenorA(valor);
  }

  @authenticate.skip()
  @get('/inmuebles-por-barrio/{barrio}')
  @response(200, {
    description: 'Consulta la lista de inmuebles con un precio menor A $$$$',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Inmueble, {includeRelations: true}),
        },
      },
    },
  })
  async inmueblesPorBarrio(
    @param.path.string('barrio') barrio: string
  ) {
    return this.inmuebleService.getInmueblesPorBarrio(barrio);
  }

  @post('/inmuebles')
  @response(200, {
    description: 'Inmueble model instance',
    content: {'application/json': {schema: getModelSchemaRef(Inmueble)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inmueble, {
            title: 'NewInmueble',
            exclude: ['id'],
          }),
        },
      },
    })
    inmueble: Omit<Inmueble, 'id'>,
  ): Promise<Inmueble> {
    return this.inmuebleRepository.create(inmueble);
  }

  @get('/inmuebles/count')
  @response(200, {
    description: 'Inmueble model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Inmueble) where?: Where<Inmueble>,
  ): Promise<Count> {
    return this.inmuebleRepository.count(where);
  }

  @authenticate.skip()
  @get('/inmuebles')
  @response(200, {
    description: 'Array of Inmueble model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Inmueble, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Inmueble) filter?: Filter<Inmueble>,
  ): Promise<Inmueble[]> {
    return this.inmuebleRepository.find(filter);
  }

  @patch('/inmuebles')
  @response(200, {
    description: 'Inmueble PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inmueble, {partial: true}),
        },
      },
    })
    inmueble: Inmueble,
    @param.where(Inmueble) where?: Where<Inmueble>,
  ): Promise<Count> {
    return this.inmuebleRepository.updateAll(inmueble, where);
  }

  @get('/inmuebles/{id}')
  @response(200, {
    description: 'Inmueble model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Inmueble, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Inmueble, {exclude: 'where'}) filter?: FilterExcludingWhere<Inmueble>
  ): Promise<Inmueble> {
    return this.inmuebleRepository.findById(id, filter);
  }

  @patch('/inmuebles/{id}')
  @response(204, {
    description: 'Inmueble PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inmueble, {partial: true}),
        },
      },
    })
    inmueble: Inmueble,
  ): Promise<void> {
    await this.inmuebleRepository.updateById(id, inmueble);
  }

  @put('/inmuebles/{id}')
  @response(204, {
    description: 'Inmueble PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() inmueble: Inmueble,
  ): Promise<void> {
    await this.inmuebleRepository.replaceById(id, inmueble);
  }

  @del('/inmuebles/{id}')
  @response(204, {
    description: 'Inmueble DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.inmuebleRepository.deleteById(id);
  }
}
