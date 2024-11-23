import { v4 as uuidV4 } from 'uuid';

/**
 * Adaptador de uuid
 */
export class UUID {

  /**
   * Generar un nuevo id basado en uuid
   * @returns string
   */
  public static generateId(): string {
    return uuidV4();
  }

}