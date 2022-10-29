import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import generador from 'password-generator';
import {llaves} from '../config/llaves';
import {Propietario} from '../models';
import {PropietarioRepository} from '../repositories/propietario.repository';
const cryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(
    @repository(PropietarioRepository)
    public propietarioRepositorio: PropietarioRepository
  ) { }

  validarAcceso(usuario: string, contrasenia: string) {
    try {
      // validar los datos en la tabla propietario
      let propietario = this.propietarioRepositorio.findOne({
        where: {
          correo: usuario,
          clave: contrasenia
        }
      });
      if (propietario)
        return propietario

      return false;
    } catch (error) {
      return false;
    }
  }

  generarClave = () => cryptoJS.MD5(generador(8, false));

  cifrarClave = (clave: string) => cryptoJS.MD5(clave).toString();

  generarTokenJWT(propietario: Propietario) {
    let token = jwt.sign({
      data: {
        id: propietario.id,
        correo: propietario.correo,
        nombre: `${propietario.nombres} ${propietario.apellidos}`
      }
    }, llaves.claveJWT);
    return token;
  }

  validarTokenJWT(token: string) {
    try {
      let datos = jwt.verify(token, llaves.claveJWT);
      console.log(datos);

      return datos;
    } catch (error) {
      return false;
    }
  }

}
