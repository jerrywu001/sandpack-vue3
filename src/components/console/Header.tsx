import { defineComponent, PropType } from 'vue';
import { ConsoleIcon } from '../../icons';
import { css } from '../../styles';
import { buttonClassName, roundedButtonClassName } from '../../styles/shared';
import { useClassNames } from '../..';

const wrapperClassName = css({
  justifyContent: 'space-between',
  borderBottom: '1px solid $colors$surface2',
  padding: '0 $space$2',
  fontFamily: '$font$mono',
  height: '$layout$headerHeight',
  minHeight: '$layout$headerHeight',
  overflowX: 'auto',
  whiteSpace: 'nowrap',
});

const flexClassName = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '$space$2',
});

interface Prop {
  currentTab: 'server' | 'client';
  setCurrentTab: (value: 'server' | 'client') => void;
  node: boolean;
}

export const Header = defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'Header',
  props: {
    currentTab: {
      type: String as PropType<'server' | 'client'>,
      required: true,
    },
    setCurrentTab: {
      type: Function as PropType< (value: 'server' | 'client') => void>,
      required: true,
    },
    node: {
      type: Boolean,
      required: true,
    },
  },
  setup(props: Prop) {
    const classNames = useClassNames();

    const buttonsClassName = classNames('console-header-button', [
      buttonClassName,
      roundedButtonClassName,
      css({ padding: '$space$1 $space$3' }),
    ]);

    return () => (
      <div
        class={classNames('console-header', [
          wrapperClassName,
          flexClassName,
        ])}
      >
        <p
          class={classNames('console-header-title', [
            css({
              lineHeight: 1,
              margin: 0,
              color: '$colors$base',
              fontSize: '$font$size',
              display: 'flex',
              alignItems: 'center',

              gap: '$space$2',
            }),
          ])}
        >
          <ConsoleIcon />
          <span>Terminal</span>
          {
            props.node && (
              <div class={classNames('console-header-actions', [flexClassName])}>
                <button
                  class={buttonsClassName}
                  data-active={props.currentTab === 'server'}
                  onClick={() => props.setCurrentTab('server')}
                  type="button"
                >
                  Server
                </button>

                <button
                  class={buttonsClassName}
                  data-active={props.currentTab === 'client'}
                  onClick={() => props.setCurrentTab('client')}
                  type="button"
                >
                  Client
                </button>
              </div>
            )
          }
        </p>
      </div>
    );
  },
});
