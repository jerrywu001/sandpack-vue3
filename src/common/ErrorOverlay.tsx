import { useClasser } from 'code-hike-classer-vue3';
import { classNames } from '../utils/classNames';
import { defineComponent } from 'vue';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { THEME_PREFIX } from '../styles';
import { absoluteClassName, errorClassName, errorMessageClassName } from '../styles/shared';

export const ErrorOverlay = defineComponent({
  name: 'ErrorOverlay',
  inheritAttrs: true,
  props: {
    className: {
      type: String,
      required: false,
      default: '',
    },
  },
  setup(props, { slots }) {
    const error = useErrorMessage();
    const c = useClasser(THEME_PREFIX);

    return () => (
      <>
        {
          !error.value.message && !slots.default ? null : (
            <div
              translate="no"
              class={classNames(
                c('overlay', 'error'),
                absoluteClassName,
                errorClassName,
                props.className,
              )}
            >
              <div class={classNames(c('error-message'), errorMessageClassName)}>
                {error.value.message || (slots.default ? slots.default() : null) }
              </div>
            </div>
          )
        }
      </>
    );
  },
});
