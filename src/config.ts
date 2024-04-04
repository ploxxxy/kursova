import { I18nConfig } from '@editorjs/editorjs'

export const INFINE_SCROLLING_PAGE_SIZE = 10

export const UkrainianEditorLocale: I18nConfig = {
  messages: {
    ui: {
      inlineToolbar: {
        converter: {
          'Convert to': 'Конвертувати в',
        },
      },
      toolbar: {
        toolbox: {
          Add: 'Додати',
        },
      },
      popover: {
        Filter: 'Пошук',
      },
      blockTunes: {
        toggler: {
          'Click to tune': 'Натисніть, щоб налаштувати',
          'or drag to move': 'або перетягніть',
        },
      },
    },
    toolNames: {
      Text: 'Текст',
      Heading: 'Заголовок',
      List: 'Список',
      Code: 'Код',
      Quote: 'Цитата',
      Delimiter: 'Розділювач',
      Image: 'Зображення',
      Link: 'Посилання',
      Table: 'Таблиця',
      Embed: 'Вставка',
      Bold: 'Жирний',
      Italic: 'Курсив',
      Underline: 'Підкреслений',
      Strikethrough: 'Закреслений',
      InlineCode: 'Код',
    },
    tools: {
      linkTool: {
        'Enter URL': 'Введіть URL',
        'Add a link': 'Додати посилання',
      },
      image: {
        'Select an Image': 'Виберіть зображення',
      },
      embed: {
        'Paste a link to embed content':
          'Вставте посилання для вставки контенту',
      },
    },
    blockTunes: {
      delete: {
        Delete: 'Видалити',
        'Click to delete': 'Натисніть знову',
      },

      moveUp: {
        'Move up': 'Перемістити вгору',
      },
      moveDown: {
        'Move down': 'Перемістити вниз',
      },
    },
  },
}
