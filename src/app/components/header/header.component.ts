import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  pageTitle: string = ''; 

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.url.subscribe(segments => {
      const currentPath = segments[0].path;
      switch (currentPath) {
        case 'productos':
          this.pageTitle = 'Productos';
          break;
        case 'carrito':
          this.pageTitle = 'Carrito';
          break;
        case 'inventario':
          this.pageTitle = 'Inventario';
      }
    });
  }
}
