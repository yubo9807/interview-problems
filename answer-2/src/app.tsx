import { defineComponent, h } from 'vue';
import PersonnelAllocation from './views/personnel-allocation';

export default defineComponent(() => {
  return () => h(<div>
    <PersonnelAllocation />
  </div>)
})
