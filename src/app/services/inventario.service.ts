import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';
import { DOMParser } from 'xmldom';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private productos: Producto[] = [];

  constructor() {
    this.cargarProductos();
  }

  obtenerProductos(): Producto[] {
    return this.productos;
  }

  agregarProducto(producto: Producto): void {
    this.productos.push(producto);
    this.guardarProductos();
  }

  actualizarProducto(index: number, producto: Producto): void {
    this.productos[index] = producto;
    this.guardarProductos();
  }

  eliminarProducto(index: number): void {
    this.productos.splice(index, 1);
    this.guardarProductos();
  }

  saveFile(file: File, filePath: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        localStorage.setItem(filePath, dataUrl);
      };
      reader.readAsDataURL(file);
    }
  }

  deleteFile(filePath: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(filePath);
    }
  }

  private guardarProductos(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const productosXML = this.convertirProductosAXML(this.productos);
      localStorage.setItem('productos', productosXML);
    }
  }

  private convertirProductosAXML(productos: Producto[]): string {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<productos>\n`;
    productos.forEach(producto => {
      xml += `  <producto id="${producto.id}">\n`;
      xml += `    <nombre>${producto.nombre}</nombre>\n`;
      xml += `    <precio>${producto.precio}</precio>\n`;
      xml += `    <imagen>${producto.imagen}</imagen>\n`;
      xml += `  </producto>\n`;
    });
    xml += `</productos>`;
    return xml;
  }

  private cargarProductos(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const productosXML = localStorage.getItem('productos');
      if (productosXML) {
        this.productos = this.parsearProductosDesdeXML(productosXML);
      } else {
        this.cargarProductosPorDefecto();
      }
    } else {
      this.cargarProductosPorDefecto();
    }
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