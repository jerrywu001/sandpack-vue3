import { useClasser } from 'code-hike-classer-vue3';
import { classNames } from '../utils/classNames';
import { defineComponent } from 'vue';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { THEME_PREFIX } from '../styles';
import { absoluteClassName, errorClassName, errorMessageClassName } from '../styles/shared';
import { RefreshButton } from '../components';

export const ErrorOverlay = defineComponent({
  name: 'ErrorOverlay',
  props: {
    clientId: {
      type: String,
      required: false,
      default: '',
    },
  },
  setup(props, { slots, attrs }) {
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
                attrs?.class || '',
              )}
            >
              <div class={classNames(c('error-message'), errorMessageClassName)}>
                {error.value.message || (slots.default ? slots.default() : null) }
              </div>
              <RefreshButton
                clientId={props.clientId}
                style={{
                  position: 'absolute',
                  right: '6px',
                  bottom: '6px',
                }}
              />
            </div>
          )
        }
      </>
    );
  },
});
