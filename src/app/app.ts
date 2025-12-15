import { Component, effect, inject, signal, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { CdkDragDrop, CdkDropList, CdkDrag, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';

import { GymService } from './services/gym.service';
import { DataService, Category, Exercise, Table, ExerciseWithTableData } from './services/data.service';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { ExerciseFormComponent } from './components/exercise-form/exercise-form.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { TableFormComponent } from './components/table-form/table-form.component';
import { NavigationComponent } from './components/navigation/navigation.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, JsonPipe, CdkDropList, CdkDrag, CdkDropListGroup, MatCardModule, MatButtonModule, MatIconModule, MatMenuModule, NavigationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  
}
