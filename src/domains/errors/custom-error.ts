
export class CustomError extends Error {

  /**
   * Iniciar nuevo error personalizado con codigo de estado
   * @param message string
   * @param ststusCode number
   */
  constructor(
    public readonly message: string,
    public readonly ststusCode: number,
  ){
    super(message);
  }

  /**
   * Error en la solicitud proveniente del cliente (400)
   * @param message string
   * @returns CustomError
   */
  public static badRequest(message: string): CustomError {
    return new CustomError(message, 400);
  }

  /**
   * Error en el acceso por credenciales hacia un recurso (401)
   * @param message string
   * @returns CustomError
   */
  public static unAuthorized(message: string): CustomError {
    return new CustomError(message, 401);
  }

  /**
   * Error de permisos hacia el recurso (403)
   * @param message string
   * @returns CustomError
   */
  public static forbidden(message: string): CustomError {
    return new CustomError(message, 403);
  }

  /**
   * Error de recurso no encontrado (404)
   * @param message string
   * @returns CustomError
   */
  public static notFound(message: string): CustomError {
    return new CustomError(message, 404);
  }

  /**
   * Error interno del servidor (500)
   * @param message string
   * @returns CustomError
   */
  public static internal(message: string): CustomError {
    return new CustomError(message, 500);
  }

}