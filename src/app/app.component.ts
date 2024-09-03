import { Component, OnInit,AfterViewInit, ViewChild } from '@angular/core';
import { AddtaskComponent } from './addtask/addtask.component';
import {
  MatDialog,MAT_DIALOG_DATA,MatDialogTitle,MatDialogContent,} from '@angular/material/dialog';
import { ApiService } from './services/api.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'newtodolist';
  displayedColumns: string[] = ['chkbox','assignedto', 'status', 'duedate', 'priority','description','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog:MatDialog,private api:ApiService){}
  ngOnInit(): void {
    this.getAllTasks();
  }
  openDialog() {
    this.dialog.open(AddtaskComponent, {
     // width:'35%'
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
        this.getAllTasks();
      }
    })
  }
  getAllTasks()
  {
    this.api.getTask().subscribe
    ({
      next:(res)=>{
       this.dataSource=new MatTableDataSource(res);
       this.dataSource.paginator=this.paginator;
       this.dataSource.sort=this.sort;
      },
      error:(err)=>{
        alert("Error while fetching the Records");
      }
    })
  }
  editTask(row:any)
  {
    this.dialog.open(AddtaskComponent,{
      width:'30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==='update'){
        this.getAllTasks();
      }
    })
  }

  deleteTask(id:number){
    this.api.deleteTask(id).subscribe({
      next:(res)=>{
        alert("Task Deleted Successfully");
        this.getAllTasks();
      },
      error:()=>{
        alert("Error while deleting the task")
      }
    })
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
