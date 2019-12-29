import { Component, OnInit, TemplateRef, Inject } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { DatePipe } from "@angular/common";
import { environment } from '@env/environment';
import { FileUploader } from 'ng2-file-upload';
import { DA_SERVICE_TOKEN, ITokenService, JWTTokenModel } from '@delon/auth';

@Component({
  selector: 'app-setting-user',
  templateUrl: './user.component.html',
})

export class UserComponent implements OnInit {

  expandForm = false;
  filterGender = [
    { text: '男', value: '1' },
    { text: '女', value: '0' }
  ];
  sGender = '';

  statuses = [
    { text: '注销', value: 'false' },
    { text: '启用', value: 'true' }
  ];
  genderValue: string = '1';
  formatterAge = value => value && `${value}`;
  parserAge = value => value && value.replace('.', '');
  rePassword: string = '';
  validateForm: FormGroup;
  searchForm: FormGroup;
  loading = true;

  pageIndex = 1;
  pageSize = 10;
  total = 1;

  dataSet: any[] = [];
  sortValue = '';
  sortKey = '';

  uploader = null;

  token = null;



  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
  ) {
    this.validateForm = this.fb.group({
      fLoginName: [null, [Validators.required]],
      fName: [null, [Validators.required]],
      fPassword: [null, [Validators.required]],
      fRePassword: [null, [CompareValidators.match('fPassword')]],
      fAge: [null, [Validators.required]],
      fGender: [null, [Validators.nullValidator]],
      fPhone: [null, [Validators.required, Validators.pattern(/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/)]],
      fEmail: [null, [Validators.email]],
      fWechat: [null, [Validators.nullValidator]],
    });

    this.searchForm = this.fb.group({
      sName: [null],
      sPhone: [null],
      // sGender: [null],
      sEnabled: [null],
      sLastLoginTime: [null]
    });

    this.token = tokenService.get(JWTTokenModel).token;

    this.uploader = new FileUploader({
      url: environment.SERVER_URL + 'User/ImportUser',
      method: 'POST',
      itemAlias: 'excel',
      headers: [{ name: "Authorization", value: "Bearer " + this.token }]
    });
  }



  get fLoginName() {
    return this.validateForm.controls.fLoginName;
  }

  get fName() {
    return this.validateForm.controls.fName;
  }

  set fName(value: any) {
    this.validateForm.controls.fName = value;
  }

  get fPassword() {
    return this.validateForm.controls.fPassword;
  }
  get fRePassword() {
    return this.validateForm.controls.fRePassword;
  }
  get fAge() {
    return this.validateForm.controls.fAge;
  }
  set fAge(value: any) {
    this.validateForm.controls.fAge = value;
  }
  get fGender() {
    return this.validateForm.controls.fGender;
  }
  set fGender(value: any) {
    this.validateForm.controls.fGender = value;
  }
  get fPhone() {
    return this.validateForm.controls.fPhone;
  }
  set fPhone(value: any) {
    this.validateForm.controls.fPhone = value;
  }
  get fEmail() {
    return this.validateForm.controls.fEmail;
  }
  set fEmail(value: any) {
    this.validateForm.controls.fEmail = value;
  }
  get fWechat() {
    return this.validateForm.controls.fWechat;
  }
  set fWechat(value: any) {
    this.validateForm.controls.fWechat = value;
  }



  get sName() {
    return this.searchForm.controls.sName;
  }

  get sPhone() {
    return this.searchForm.controls.sPhone;
  }

  // get sGender() {
  //   return this.searchForm.controls.sGender;
  // }

  // set sGender(value: any) {
  //   this.validateForm.controls.sGender = value;
  // }

  get sEnabled() {
    return this.searchForm.controls.sEnabled;
  }

  get sLastLoginTime() {
    return this.searchForm.controls.sLastLoginTime;
  }



  ngOnInit() {
    this.getUsers();
  }

  add(tpl: TemplateRef<any>) {
    this.validateForm.reset();
    this.modalSrv.create({
      nzTitle: '添加用户',
      nzContent: tpl,
      nzOnOk: () => {
        this.validate();
        this.addUser();
      },
    });
  }

  resetRePassword() {
    this.rePassword = '';
  }

  pageIndexChange(pageIndex: number) {
    this.loading = true;
    this.pageIndex = pageIndex;
    this.getUsers();
  }

  pageSizeChange(pageSize: number) {
    this.loading = true;
    this.pageSize = pageSize;
    this.getUsers();
  }

  //查询用户
  getUsers() {
    this.http
      .get('User', {
        Name: this.sName.value || '',
        Phone: this.sPhone.value || '',
        Gender: this.sGender,
        Enabled: this.sEnabled.value || '',
        LastLoginTimeStart: this.sLastLoginTime.value && this.datePipe.transform(this.sLastLoginTime.value[0], 'yyyy-MM-dd HH:mm') || '',
        LastLoginTimeEnd: this.sLastLoginTime.value && this.datePipe.transform(this.sLastLoginTime.value[1], 'yyyy-MM-dd HH:mm') || '',
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        SortField: this.sortKey,
        OrderByType: this.sortValue
      })
      .subscribe((d: any) => {
        this.loading = false;
        this.dataSet = d.Items;
        this.pageIndex = d.PageIndex;
        this.pageSize = d.PageSize;
        this.total = d.TotalCount;
      });
  }

  sort(sort: { key: string, value: string }): void {
    this.sortKey = sort.key;
    if (sort.value == "ascend")
      this.sortValue = '0';
    else if (sort.value == "descend")
      this.sortValue = '1';
    else
      this.sortValue = '';
    this.getUsers();
  }

  updateFilter(values: string[]): void {
    if (values.length != this.filterGender.length && values.length > 0)
      this.sGender = values[0];
    else
      this.sGender = '';
    this.getUsers();
  }



  //添加用户
  addUser() {
    this.http
      .post('User', {
        LoginName: this.fLoginName.value,
        Password: this.fPassword.value,
        Name: this.fName.value,
        Gender: parseInt(this.fGender.value),
        Age: this.fAge.value,
        Phone: this.fPhone.value,
        Email: this.fEmail.value,
        WeChat: this.fWechat.value
      })
      .subscribe(() => {
        this.pageIndex = 1;
        this.getUsers();
      });
  }

  //删除用户
  delete(id: any) {
    this.modalSrv.confirm({
      nzTitle: '确认删除吗?',
      nzOnOk: () => this.http
        .delete(`User/${id}`)
        .subscribe(() => {
          this.getUsers();
        })
    });
  }

  //注销用户
  disable(id: any) {
    this.modalSrv.confirm({
      nzTitle: '确认注销吗?',
      nzOnOk: () => this.http
        .put(`User/Disable/${id}`)
        .subscribe(() => {
          this.getUsers();
        })
    });
  }

  //启用用户
  enable(id: any) {
    this.modalSrv.confirm({
      nzTitle: '确认启用吗?',
      nzOnOk: () => this.http
        .put(`User/Enable/${id}`)
        .subscribe(() => {
          this.getUsers();
        })
    });
  }

  //编辑用户
  async edit(id: any, tpl: TemplateRef<any>) {
    this.validateForm.reset();
    await this.http.get(`User/${id}`).toPromise().then((d: any) => {
      this.fName.value = d.Name;
      this.genderValue = d.Gender.toString();
      this.fAge.value = d.Age;
      this.fPhone.value = d.Phone;
      this.fEmail.value = d.Email;
      this.fWechat.value = d.WeChat;
    });
    this.modalSrv.create({
      nzTitle: '编辑用户',
      nzContent: tpl,
      nzOnOk: () => {
        // this.loading = true;
        this.validate()

        this.editUser(id);
      },
    });
  }

  editUser(id: any) {
    this.http
      .put(`User/${id}`, {
        Name: this.fName.value,
        Gender: parseInt(this.fGender.value),
        Age: this.fAge.value,
        Phone: this.fPhone.value,
        Email: this.fEmail.value,
        WeChat: this.fWechat.value
      })
      .subscribe(() => {
        this.getUsers();
      });
  }

  validate(): boolean {
    let flag = true;
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
      flag = flag && !this.validateForm.controls[key].invalid;
    }
    if (!flag) {
      return flag;
    }
  }

  //导出
  // export() {
  //   this.http
  //     .get('User/ExportUsers', {
  //       Name: this.sName.value || '',
  //       Phone: this.sPhone.value || '',
  //       Gender: this.sGender,
  //       Enabled: this.sEnabled.value || '',
  //       LastLoginTimeStart: this.sLastLoginTime.value && this.datePipe.transform(this.sLastLoginTime.value[0], 'yyyy-MM-dd HH:mm') || '',
  //       LastLoginTimeEnd: this.sLastLoginTime.value && this.datePipe.transform(this.sLastLoginTime.value[1], 'yyyy-MM-dd HH:mm') || '',
  //       OrderFileds: this.sortValue && (this.sortKey + this.sortValue)
  //     }, { responseType: "blob" })
  //     .subscribe((d: any) => {
  //       var blob = new Blob([d]); //创建一个blob对象
  //       var a = document.createElement('a'); //创建一个<a></a>标签
  //       a.href = URL.createObjectURL(blob); // response is a blob
  //       a.download = "用户.xlsx";  //文件名称
  //       a.style.display = 'none';
  //       document.body.appendChild(a);
  //       a.click();
  //       a.remove();
  //     });
  // }


  export() {
    this.http
      .get('User/ExportUser', {
        Name: this.sName.value || '',
        Phone: this.sPhone.value || '',
        Gender: this.sGender,
        Enabled: this.sEnabled.value || '',
        LastLoginTimeStart: this.sLastLoginTime.value && this.datePipe.transform(this.sLastLoginTime.value[0], 'yyyy-MM-dd HH:mm') || '',
        LastLoginTimeEnd: this.sLastLoginTime.value && this.datePipe.transform(this.sLastLoginTime.value[1], 'yyyy-MM-dd HH:mm') || '',
        OrderFileds: this.sortValue && (this.sortKey + this.sortValue)
      })
      .subscribe((d: any) => {
        var a = document.createElement('a'); //创建一个<a></a>标签
        a.href = `${environment.SERVER_URL}ExportExcel/${d.FileName}?Authorization=${this.token}&FileId=${d.FileId}`;
        a.download = "系统用户.xlsx";  //文件名称   //跨域的时候 名字不会改
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  }

  exportTemplate() {
    var a = document.createElement('a'); //创建一个<a></a>标签
    a.href = `${environment.SERVER_URL}template/user.xlsx?Authorization=${this.token}`;
    a.download = "用户模板.xlsx";  //文件名称   //跨域的时候 名字不会改
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }





  // 选择的文件
  selectedFileOnChanged(item) {
    console.log(item);
  }
  // 上传文件，这里是全部上传
  fileAllUp() {
    if(this.uploader.queue.length==0){
      this.msg.error('请选择上传excel文件');
      return;
    }
    this.uploader.uploadAll();
    this.uploader.queue[0].onSuccess = (response, status, headers) => {

      var result = JSON.parse(response);
      // 上传文件成功
      if (result.Success == true) {
        this.msg.success('上传成功');
        this.getUsers();
      } else {
        this.msg.error(result.ErrorMsg);
      }
    }
  }

  // 清空选择列表
  fileAllDelete(): any {
    this.uploader.clearQueue();
  }


}

export class CompareValidators {
  static match(targetField: string): ValidatorFn {
    return (self: AbstractControl): { [key: string]: any } => {    //这里严格按照ValidatorFn的声明来
      let _form = self.parent;
      if (_form) {
        let targetControl: AbstractControl = _form.controls[targetField];
        if (targetControl.value == null || (targetControl.value && self.value != targetControl.value)) {   //如果两个值不一致
          return { match: '' }
        }
      }
    }
  }
}