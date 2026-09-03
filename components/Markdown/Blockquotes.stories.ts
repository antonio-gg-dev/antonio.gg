import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MarkdownWrapper from '@/components/Markdown/MarkdownWrapper.vue'

interface args {
  content: string
}

export default {
  title: 'Markdown/Blockquotes',
  argTypes: {
    content: {
      control: 'text',
    },
  },
  render(args) {
    return {
      components: { MarkdownWrapper },
      computed: {
        template() {
          return args.content
        },
      },
      template: `
        <MarkdownWrapper
          :template="template"
        />
      `,
    }
  },
} satisfies Meta<args>

export const OneBlockquote: StoryObj<args> = {
  args: {
    content: `\
> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur maximus diam quam, ac maximus neque mollis at.
> Ut finibus non erat in malesuada. Cras libero magna, luctus ac feugiat non, viverra pretium augue.
> Donec nec placerat justo. Nunc eu ante at magna fermentum lobortis sed et tellus. Integer egestas iaculis semper.
> Cras a blandit dui. Sed rhoncus magna arcu.`,
  },
}

export const TwoBlockquotes: StoryObj<args> = {
  args: {
    content: `\
> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas eu tellus eget orci vehicula mattis.
> Fusce at lacus nunc. Nulla rutrum ex nisi, non consequat arcu varius ut. Praesent tincidunt sagittis tristique.
> Ut suscipit lacus at ultricies posuere. Mauris tempor, odio eu commodo mollis, ante quam elementum eros, 
> in congue nibh purus sed diam. Fusce pharetra posuere dui sit amet laoreet. Suspendisse velit erat, 
> congue non nisl convallis, rhoncus euismod tortor. Pellentesque tincidunt sit amet ipsum et sollicitudin. 

> Nam rutrum urna nec convallis sollicitudin. Donec lacus lectus, lobortis in sem nec, convallis dictum enim. 
> Praesent sodales sed turpis et feugiat. Morbi eu urna metus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
> Curabitur sit amet rhoncus libero. Fusce at dolor consectetur, laoreet ante eu, tincidunt erat.`,
  },
}

export const OneBlockquoteWithTwoParagraphs: StoryObj<args> = {
  args: {
    content: `\
> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas eu tellus eget orci vehicula mattis.
> Fusce at lacus nunc. Nulla rutrum ex nisi, non consequat arcu varius ut. Praesent tincidunt sagittis tristique.
> Ut suscipit lacus at ultricies posuere. Mauris tempor, odio eu commodo mollis, ante quam elementum eros, 
> in congue nibh purus sed diam. Fusce pharetra posuere dui sit amet laoreet. Suspendisse velit erat, 
> congue non nisl convallis, rhoncus euismod tortor. Pellentesque tincidunt sit amet ipsum et sollicitudin. 
>
> Nam rutrum urna nec convallis sollicitudin. Donec lacus lectus, lobortis in sem nec, convallis dictum enim. 
> Praesent sodales sed turpis et feugiat. Morbi eu urna metus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
> Curabitur sit amet rhoncus libero. Fusce at dolor consectetur, laoreet ante eu, tincidunt erat.`,
  },
}

export const BlockquoteWithBoldAndItalic: StoryObj<args> = {
  args: {
    content: `\
> **Lorem ipsum** dolor sit amet, _consectetur adipiscing_ elit. Sed cursus risus id velit lacinia tempus.
> Mauris in nisi ligula. \`Ut pulvinar\` diam purus. Nulla dignissim ante non rutrum cursus. Phasellus justo nisi,
> facilisis nec quam vitae, dictum porta ex. **_In sollicitudin_**, libero ornare ornare cursus,
> lorem justo blandit odio, eu fermentum nibh metus fermentum est.
> **Sed** _sed_ \`nisi\` at tortor pretium volutpat quis at metus. Integer venenatis feugiat pulvinar.
> Aenean consequat at dolor at consequat. Proin id auctor dolor. Aenean porta erat vitae egestas vestibulum.`,
  },
}
