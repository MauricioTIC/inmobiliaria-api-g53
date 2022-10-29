import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Inmueble} from '../models';
import {InmuebleRepository} from '../repositories/inmueble.repository';

@injectable({scope: BindingScope.TRANSIENT})
export class InmuebleService {
  constructor(
    @repository(InmuebleRepository)
    public inmuebleRepository: InmuebleRepository
  ) { }

  getInmueblesDisponibles(): Promise<Inmueble[]> {
    let inmuebles = this.inmuebleRepository.find({
      where: {
        estado: 'A'
      }
    });
    return inmuebles;
  }

  // select * from inmuebles where precio >= 1000000
  getInmueblesPorPrecioMayorA(valor: number) {
    let inmuebles = this.inmuebleRepository.find({
      where: {
        precio: {gt: valor},
        estado: 'A'
      }
    });
    return inmuebles;
  }

  getInmueblesPorPrecioMenorA = (valor: number) => {
    let inmuebles = this.inmuebleRepository.find({
      where: {
        precio: {lt: valor},
        estado: 'A'
      }
    });
    return inmuebles;
  }

  getInmueblesPorBarrio = (ubicacion: string) => {
    let inmuebles = this.inmuebleRepository.find({
      include: ['imagenes'],
      where: {
        barrio: `/.*${ubicacion}.*/`,
        estado: 'A'
      }
    });
    return inmuebles;
  }
}
