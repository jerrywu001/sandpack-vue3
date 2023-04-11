import { css } from '../styles';
import { defineComponent } from 'vue';
import { fadeIn } from '../styles/shared';
import { useSandpackPreviewProgress } from '../hooks/useSandpackPreviewProgress';

export const DependenciesProgress = defineComponent({
  name: 'SandpackLayout',
  props: {
    clientId: {
      type: String,
      required: false,
      default: undefined,
    },
  },
  setup(props) {
    const progressMessage = useSandpackPreviewProgress({
      timeout: 3_000,
      clientId: props?.clientId,
    });

    return () => (
      <>
        {
          !progressMessage.value ? null : (
            <div class={progressClassName.toString()}>
              <p>{progressMessage.value}</p>
            </div>
          )
        }
      </>
    );
  },
});

const progressClassName = css({
  position: 'absolute',
  left: '$space$5',
  bottom: '$space$4',
  zIndex: '$top',
  color: '$colors$clickable',
  animation: `${fadeIn} 150ms ease`,
  fontFamily: '$font$mono',
  fontSize: '.8em',
  width: '75%',
  p: {
    whiteSpace: 'nowrap',
    margin: 0,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
});
