import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder,Validator,FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-addtask',
  templateUrl: './addtask.component.html',
  styleUrl: './addtask.component.css'
})
export class AddtaskComponent implements OnInit{

  TaskForm!: FormGroup;
  actionBtn:string="Save";
  constructor(private formBuilder:FormBuilder,private api:ApiService,
    private dialogRef:MatDialogRef<AddtaskComponent>,
    @Inject(MAT_DIALOG_DATA) public editData:any
  ){}
  ngOnInit(): void {
      this.TaskForm=this.formBuilder.group({
        assignedto:['',Validators.required],
        status:['',Validators.required],
        duedate:['',Validators.required],
        priority:['',Validators.required],
        description:['',Validators.required]
      })

     if(this.editData){
      this.actionBtn="Update";
      this.TaskForm.controls['assignedto'].setValue(this.editData.assignedto);
      this.TaskForm.controls['status'].setValue(this.editData.status);
      this.TaskForm.controls['duedate'].setValue(this.editData.duedate);
      this.TaskForm.controls['priority'].setValue(this.editData.priority);
      this.TaskForm.controls['description'].setValue(this.editData.description);
     }
  }

  addTask()
  {
   if(!this.editData)
   {
    if(this.TaskForm.valid)
      {
        this.api.postTask(this.TaskForm.value).subscribe
        ({
          next:(res)=>{
            alert("Task Added Successfully");
            this.TaskForm.reset();
            this.dialogRef.close('save')
          },
          error:()=>{
            alert("Error while adding the Task")
          }
        })
      }
   }
   else
   {
    this.updateTask()
  }
}
updateTask()
{
  this.api.putTask(this.TaskForm.value,this.editData.id).subscribe({
    next:(res)=>{
      alert("Task updated successfully");
      this.TaskForm.reset();
      this.dialogRef.close('update');
    },
    error:()=>{
      alert("Error while updating the task");
    }
  })
}
}
