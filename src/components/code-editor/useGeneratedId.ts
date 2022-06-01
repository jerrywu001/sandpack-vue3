/* eslint-disable arrow-body-style */
import { ref } from 'vue';
import { generateRandomId } from '../../utils/stringUtils';

export const useGeneratedId = (id?: string) => {
  const useId = null; // TODO:
  const value = ref('');

  value.value = typeof id === 'string'
    ? id
    :
    typeof useId === 'function'
      // @ts-ignore
      ? useId()
      : generateRandomId();
  return value;
};
