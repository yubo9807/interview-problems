import style from './index.module.scss';
import { defineComponent, h, onMounted, reactive, Ref, ref } from 'vue';
import { cloneObj } from '@/utils/object';
import { createNum, randomNum } from '@/utils/number';
import drag from './drag';
import { ElForm, ElFormItem, ElInput } from 'element-plus';

type Id = number | string

interface Organization {
  id: Id
  parent: Id
  name: string
}
interface Staff {
  id: Id
  parent: Id
  name: string
  age: number | ''
  activace: boolean
  isAdmin: boolean
}

const iter = createNum();


export default defineComponent(() => {

  // 组织数据
  const organization: Ref<Organization[]> = ref([
    { id: 1, parent: null, name: '公司' },
    { id: 2, parent: null, name: '组织-1' },
    { id: 3, parent: 1, name: '组织-2' },
    // { id: 4, parent: 3, name: '组织-2' },
  ])
  // 员工数据
  const staff: Ref<Staff[]> = ref([
    { id: 1, parent: 1, name: '员工1', age: 18, activace: true, isAdmin: false },
    { id: 2, parent: 1, name: '员工2', age: 20, activace: true, isAdmin: true },
    { id: 3, parent: 1, name: '员工3', age: 32, activace: true, isAdmin: false },
    { id: 4, parent: 2, name: '员工4', age: 10, activace: false, isAdmin: false },
    { id: 5, parent: 2, name: '员工5', age: 99, activace: true, isAdmin: false },
  ])
  const rules = {
    name: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
    ],
    age: [
      { required: true, message: '请输入年龄', trigger: 'blur' },
    ]
  }



  // #region 拖拽功能
  const organizationEl = ref(null);

  onMounted(() => {
    drag(organizationEl.value, exchangeOfPosition)
  })

  /**
   * 调换位置
   * @param from 
   * @param to 
   */
  function exchangeOfPosition(fromEl: HTMLElement, toEl: HTMLElement) {
    if (!fromEl || !toEl) return;
    const from = fromEl.dataset.name;
    let to = toEl.dataset.name;

    // if(!from || !to) return;

    // 组织到最外层，不在任何组织下
    if (from.length === 1 && !to) {
      const newOrganization: Organization[] = cloneObj(organization.value);
      newOrganization[from].parent = null;
      organization.value = newOrganization;
      return;
    }

    exchangeData(from.split('-').map(val => Number(val)), to.split('-').map(val => Number(val)));
  }

  /**
   * 改变数据
   * @param form 
   * @param to 
   */
  function exchangeData(from: number[], to: number[]) {
    const newOrganization: Organization[] = cloneObj(organization.value);
    const newStaff: Staff[] = cloneObj(staff.value);
    
    // 组织不能到员工下
    if (from.length < to.length) return;

    // 调换组织的位置
    // if (from.length === 1 && to.length === 1) {
    //   [newOrganization[from[0]], newOrganization[to[0]]] = [newOrganization[to[0]], newOrganization[from[0]]];
    //   organization.value = newOrganization;
    //   return;
    // }

    // 组织到组织下
    if (from.length === 1 && to.length === 1) {
      newOrganization[from[0]].parent = newOrganization[to[0]].id;

      // 递归，目标 parent 是否已经包含自己
      function query(id: Id, parent: Id) {
        const item = newOrganization.find(val => val.id === id);
        if (item.parent === null) return false;
        if (item.id === parent) return true;
        else return query(item.parent, parent);
      }
      const flag = query(newOrganization[to[0]].id, newOrganization[from[0]].id);
      if (flag) return;
      
      organization.value = newOrganization;
      return;
    }
    
    // 员工到其他组织下
    if (from.length > to.length) {
      newStaff[from[1]].parent = newOrganization[to[0]].id;
      // 将拿到的员工放到末尾
      const [ item ] = newStaff.splice(from[1], 1);
      newStaff.push(item);

      staff.value = newStaff;
      return;
    }
    
    // 员工调岗
    if (from[0] !== to[0]) {
      newStaff[from[1]].parent = newOrganization[to[0]].id;
    }
    [newStaff[from[1]], newStaff[to[1]]] = [newStaff[to[1]], newStaff[from[1]]];
    staff.value = newStaff;
  }
  // #endregion



  // #region 取消与提交
  // 数据备份
  const backupsOrganization = cloneObj(organization.value);
  const backupsStaff = cloneObj(staff.value);

  /**
   * 取消修改
   */
  function cancel() {
    organization.value = backupsOrganization;
    staff.value = backupsStaff;
  }

  const elformRef = ref([]);

  /**
   * 提交数据
   */
  async function submit() {
    const locks = [];

    elformRef.value.forEach((val, index, self) => {
      val.validate(async valid => {
        locks.push(!valid);
        locks.length >= self.length && send();
      });
    })

    function send() {
      if (locks.includes(true)) return;
      const newOrganization = cloneObj(organization.value);
      const newStaff = cloneObj(staff.value);
      console.log(newOrganization, newStaff);
    }
  }
  // #endregion



  // #region 添加与删除（组织/员工）
  function addOrganization() {
    const id = Date.now() + '' + randomNum(100000);
    organization.value.push({ id, name: '', parent: null });
  }

  function delOrganization(id: Id) {
    const index = organization.value.findIndex(val => val.id == id);
    organization.value.splice(index, 1);
  }

  function addStaff(parent: Id) {
    const id = Date.now() + '' + randomNum(100000);
    staff.value.push({ id, parent, name: '', age: '', activace: false, isAdmin: false });
  }

  function delStaff(id: Id) {
    const index = staff.value.findIndex(val => val.id == id);
    staff.value.splice(index, 1);
  }
  // #endregion
  


  // #region 递归组件
  const Recursive = defineComponent({
    props: {
      parent: {
        type: [null, Number, String],
        default: null,
      }
    },
    setup(props) {
      return () => h(<ul>{
        organization.value.map((val, i) => {
          if (val.parent !== props.parent) return null;

          return <li key={i} class={style.box} draggable data-name={i}>
            组织名称：
            <ElForm class={style['organization-input']} ref={el => elformRef.value[iter.next().value as number] = el} model={val} rules={rules}>{{
              default: () => <ElFormItem prop='name'>{{
                default: () => <ElInput placeholder='请输入组织名称' modelValue={val.name} onInput={value => val.name = value} />
              }}</ElFormItem>
            }}</ElForm>
            <span class={style['delete-organization']} onClick={() => delOrganization(val.id)}>X</span>

            {/* 员工列表 */}
            <ul class={style.icons}>{staff.value.map((item, j) => {
              if (item.parent === val.id) return <li>=</li>;
            })}</ul>
            <ul>{
              staff.value.map((item, j) => {
                if (item.parent !== val.id) return null; 
                return <li key={j} draggable data-name={i + '-' + j}>
                  <ElForm class={style['staff-info']} ref={el => elformRef.value[iter.next().value as number] = el} model={item} rules={rules}>{{
                    default: () => <div>
                      <ElFormItem prop='name'>{{
                        default: () => <ElInput placeholder='请输入员工名称' modelValue={item.name} onInput={val => item.name = val}/>
                      }}</ElFormItem>
                      <ElFormItem prop='age'>{{
                        default: () => <ElInput placeholder='请输入员工年龄' modelValue={item.age} onInput={val => item.age = Number(val)} />
                      }}</ElFormItem>
                      <ElFormItem>{{
                        default: () => <input type="checkbox" checked={item.activace} onChange={(e: any) => item.activace = e.target.checked} />
                      }}</ElFormItem>
                      <ElFormItem>{{
                        default: () => <input type="checkbox" disabled={!item.activace} checked={item.isAdmin} onChange={(e: any) => item.isAdmin = e.target.checked} />
                      }}</ElFormItem>
                      <button onClick={() => delStaff(item.id)}>删除</button>
                    </div>
                  }}
                  </ElForm>
                </li>;
              })
            }</ul>

            <button onClick={() => addStaff(val.id)}>添加员工</button>

            {/* 组件递归渲染 */}
            <Recursive parent={val.id} />
          </li>
        })
      }</ul>);
    }
  });
  // #endregion
  
  
  
  return () => h(<div ref={organizationEl}>
    <Recursive />

    <button onClick={addOrganization}>添加组织</button>

    <div class={style.btns}>
      <button onClick={cancel}>取消</button>
      <button onClick={submit}>提交</button>
    </div>
  </div>)


})
