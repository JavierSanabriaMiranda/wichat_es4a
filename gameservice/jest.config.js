/**
 * @file jest.config.js
 * @description Configuración base para Jest en un entorno de Node.js.
 * Este archivo define cómo Jest debe ejecutar las pruebas, incluyendo el entorno
 * y los tipos de archivos que puede manejar.
 */

module.exports = {
  /**
   * Define el entorno de ejecución para las pruebas.
   * En este caso, se usa 'node' ya que el proyecto se basa en un entorno backend con Node.js,
   * lo que desactiva características específicas del navegador como el DOM.
   */
  testEnvironment: 'node',

  /**
   * Especifica las extensiones de archivo que Jest reconocerá y procesará.
   * Aquí se incluyen archivos JavaScript (.js) y JSON (.json).
   */
  moduleFileExtensions: ['js', 'json'],
};
