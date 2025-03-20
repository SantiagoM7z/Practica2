import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private productos: Producto[] = [];

  constructor() {
    this.cargarProductosPorDefecto();
  }

  obtenerProducto(): Producto[] {
    return this.productos;
  }

  private cargarProductosPorDefecto(): void {
    const productosXML = `
      <?xml version="1.0" encoding="UTF-8"?>
      <productos>
      <producto id="1">
      <nombre>Gorra de béisbol de algodón con bordado de cruz unisex</nombre>
      <precio>120</precio>
      <imagen>assets/Gorra1.jpg</imagen>
      </producto>
      <producto id="2">
      <nombre>Gorra New Era México</nombre>
      <precio>799</precio>
      <imagen>assets/Gorra2.jpg</imagen>
      </producto>
      <producto id="3">
      <nombre>Volcom Full Stone Flexfit Cap (S/M - Black)</nombre>
      <precio>299</precio>
      <imagen>assets/Gorra3.jpg</imagen>
      </producto>
      <producto id="4">
      <nombre>vineyard vines Gorra de béisbol con Logotipo de Ballena para Hombre</nombre>
      <precio>1159</precio>
      <imagen>assets/Gorra4.jpg</imagen>
      </producto>
      </productos>
    `;
    this.productos = this.parsearProductosDesdeXML(productosXML);
  }

  private parsearProductosDesdeXML(xml: string): Producto[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'application/xml');
    const productos: Producto[] = [];
    const productosNodes = xmlDoc.getElementsByTagName('producto');
    for (let i = 0; i < productosNodes.length; i++) {
      const productoNode = productosNodes[i];
      const id = Number(productoNode.getAttribute('id'));
      const nombre = productoNode.getElementsByTagName('nombre')[0].textContent || '';
      const precio = Number(productoNode.getElementsByTagName('precio')[0].textContent);
      const imagen = productoNode.getElementsByTagName('imagen')[0].textContent || '';
      productos.push(new Producto(id, nombre, precio, imagen));
    }
    return productos;
  }
}