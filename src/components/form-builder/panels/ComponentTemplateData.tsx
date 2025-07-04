import { 
  FiType, 
  FiMail, 
  FiLock, 
  FiCalendar, 
  FiClock, 
  FiHash, 
  FiAlignLeft, 
  FiList, 
  FiCheckSquare, 
  FiCircle, 
  FiUpload, 
  FiMousePointer,
  FiToggleLeft,
  FiStar,
  FiSliders,
  FiGrid,
  FiColumns,
  FiLayers,
  FiLayout,
  FiBox,
  FiTable,
  FiImage,
  FiFileText,
  FiBarChart,
  FiTrendingUp,
} from 'react-icons/fi';

export interface LocalComponentTemplate {
  id: string;
  type: string;
  title: string; // Use title instead of label for display
  icon: React.ComponentType<any>;
  description: string;
  category: string;
  defaultProps: Record<string, any>;
  dataBindable?: boolean;
}

export interface ComponentCategory {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  components: LocalComponentTemplate[];
}

// Tabs for main sections
export enum PaletteTab {
  TOOLBOX = 'toolbox',
  SOURCES = 'sources',
  GENERATOR = 'generator'
}

// Define our component templates
export const componentCategories: ComponentCategory[] = [
  {
    id: 'input',
    title: 'Input Elements',
    icon: FiType,
    components: [
      {
        id: 'text-input',
        type: 'text',
        title: 'Text Input',
        icon: FiType,
        description: 'Single line text input',
        category: 'input',
        defaultProps: {
          label: 'Text Field',
          placeholder: 'Enter text...',
          name: 'textField',
          required: false
        },
        dataBindable: true
      },
      {
        id: 'email-input',
        type: 'email',
        title: 'Email Input',
        icon: FiMail,
        description: 'Email address input',
        category: 'input',
        defaultProps: {
          label: 'Email',
          placeholder: 'Enter email...',
          name: 'email',
          required: false
        },
        dataBindable: true
      },
      {
        id: 'password-input',
        type: 'password',
        title: 'Password Input',
        icon: FiLock,
        description: 'Password input field',
        category: 'input',
        defaultProps: {
          label: 'Password',
          placeholder: 'Enter password...',
          name: 'password',
          required: false
        },
        dataBindable: false
      },
      {
        id: 'number-input',
        type: 'number',
        title: 'Number Input',
        icon: FiHash,
        description: 'Numeric input field',
        category: 'input',
        defaultProps: {
          label: 'Number',
          placeholder: 'Enter number...',
          name: 'number',
          required: false
        },
        dataBindable: true
      },
      {
        id: 'date-input',
        type: 'date',
        title: 'Date Input',
        icon: FiCalendar,
        description: 'Date picker input',
        category: 'input',
        defaultProps: {
          label: 'Date',
          name: 'date',
          required: false
        },
        dataBindable: true
      },
      {
        id: 'time-input',
        type: 'time',
        title: 'Time Input',
        icon: FiClock,
        description: 'Time picker input',
        category: 'input',
        defaultProps: {
          label: 'Time',
          name: 'time',
          required: false
        },
        dataBindable: true
      },
      {
        id: 'textarea',
        type: 'textarea',
        title: 'Textarea',
        icon: FiAlignLeft,
        description: 'Multi-line text input',
        category: 'input',
        defaultProps: {
          label: 'Description',
          placeholder: 'Enter description...',
          name: 'description',
          rows: 3,
          required: false
        },
        dataBindable: true
      }
    ]
  },
  {
    id: 'selection',
    title: 'Selection Elements',
    icon: FiList,
    components: [
      {
        id: 'select',
        type: 'select',
        title: 'Select Dropdown',
        icon: FiList,
        description: 'Dropdown selection',
        category: 'input',
        defaultProps: {
          label: 'Select Option',
          name: 'select',
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' }
          ],
          required: false
        },
        dataBindable: true
      },
      {
        id: 'radio',
        type: 'radio',
        title: 'Radio Group',
        icon: FiCircle,
        description: 'Radio button group',
        category: 'input',
        defaultProps: {
          label: 'Choose Option',
          name: 'radio',
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' }
          ],
          required: false
        },
        dataBindable: true
      },
      {
        id: 'checkbox',
        type: 'checkbox',
        title: 'Checkbox Group',
        icon: FiCheckSquare,
        description: 'Checkbox selection',
        category: 'input',
        defaultProps: {
          label: 'Select Options',
          name: 'checkbox',
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' }
          ],
          required: false
        },
        dataBindable: true
      },
      {
        id: 'toggle',
        type: 'toggle',
        title: 'Toggle Switch',
        icon: FiToggleLeft,
        description: 'Toggle switch element',
        category: 'input',
        defaultProps: {
          label: 'Enable Feature',
          name: 'toggle',
          required: false
        },
        dataBindable: true
      }
    ]
  },
  {
    id: 'display',
    title: 'Display Elements',
    icon: FiLayout,
    components: [
      {
        id: 'heading',
        type: 'heading',
        title: 'Heading',
        icon: FiType,
        description: 'Text heading element',
        category: 'display',
        defaultProps: {
          text: 'Heading Text',
          level: 'h2',
          className: 'text-2xl font-bold'
        },
        dataBindable: true
      },
      {
        id: 'text',
        type: 'text',
        title: 'Text Block',
        icon: FiFileText,
        description: 'Static text content',
        category: 'display',
        defaultProps: {
          text: 'This is a text block.',
          className: 'text-gray-700'
        },
        dataBindable: true
      },
      {
        id: 'divider',
        type: 'divider',
        title: 'Divider',
        icon: FiGrid,
        description: 'Horizontal divider line',
        category: 'display',
        defaultProps: {
          className: 'border-t border-gray-200 my-4'
        },
        dataBindable: false
      },
      {
        id: 'spacer',
        type: 'spacer',
        title: 'Spacer',
        icon: FiBox,
        description: 'Empty space element',
        category: 'display',
        defaultProps: {
          height: 20
        },
        dataBindable: false
      },
      {
        id: 'image',
        type: 'image',
        title: 'Image',
        icon: FiImage,
        description: 'Image display element',
        category: 'display',
        defaultProps: {
          src: 'https://via.placeholder.com/300x200',
          alt: 'Placeholder image',
          className: 'rounded-lg'
        },
        dataBindable: true
      }
    ]
  },
  {
    id: 'interactive',
    title: 'Interactive Elements',
    icon: FiMousePointer,
    components: [
      {
        id: 'button',
        type: 'button',
        title: 'Button',
        icon: FiMousePointer,
        description: 'Action button',
        category: 'layout',
        defaultProps: {
          label: 'Click Me',
          variant: 'primary',
          size: 'md',
          buttonType: 'button'
        },
        dataBindable: false
      },
      {
        id: 'file-upload',
        type: 'file',
        title: 'File Upload',
        icon: FiUpload,
        description: 'File upload input',
        category: 'input',
        defaultProps: {
          label: 'Upload File',
          name: 'file',
          accept: '*',
          multiple: false,
          required: false
        },
        dataBindable: false
      },
      {
        id: 'rating',
        type: 'rating',
        title: 'Star Rating',
        icon: FiStar,
        description: 'Star rating component',
        category: 'input',
        defaultProps: {
          label: 'Rate this',
          name: 'rating',
          max: 5,
          required: false
        },
        dataBindable: true
      },
      {
        id: 'slider',
        type: 'slider',
        title: 'Range Slider',
        icon: FiSliders,
        description: 'Range slider input',
        category: 'input',
        defaultProps: {
          label: 'Select Value',
          name: 'slider',
          min: 0,
          max: 100,
          step: 1,
          required: false
        },
        dataBindable: true
      }
    ]
  },
  {
    id: 'layout',
    title: 'Layout Elements',
    icon: FiColumns,
    components: [
      {
        id: 'container',
        type: 'container',
        title: 'Container',
        icon: FiBox,
        description: 'Generic container',
        category: 'layout',
        defaultProps: {
          className: 'p-4 border border-gray-200 rounded-lg',
          children: []
        },
        dataBindable: false
      },
      {
        id: 'grid',
        type: 'grid',
        title: 'Grid Layout',
        icon: FiGrid,
        description: 'Grid layout container',
        category: 'layout',
        defaultProps: {
          columns: 2,
          gap: 4,
          className: 'grid gap-4',
          children: []
        },
        dataBindable: false
      },
      {
        id: 'columns',
        type: 'columns',
        title: 'Columns',
        icon: FiColumns,
        description: 'Column layout',
        category: 'layout',
        defaultProps: {
          columns: [
            { width: '50%', children: [] },
            { width: '50%', children: [] }
          ]
        },
        dataBindable: false
      },
      {
        id: 'accordion',
        type: 'accordion',
        title: 'Accordion',
        icon: FiLayers,
        description: 'Collapsible content sections',
        category: 'layout',
        defaultProps: {
          panels: [
            {
              id: 'panel1',
              title: 'Section 1',
              content: 'Content for section 1',
              isOpen: false
            },
            {
              id: 'panel2',
              title: 'Section 2',
              content: 'Content for section 2',
              isOpen: false
            }
          ]
        },
        dataBindable: false
      }
    ]
  },
  {
    id: 'data',
    title: 'Data Elements',
    icon: FiTable,
    components: [
      {
        id: 'table',
        type: 'table',
        title: 'Data Table',
        icon: FiTable,
        description: 'Data table display',
        category: 'data',
        defaultProps: {
          columns: [
            { key: 'name', title: 'Name' },
            { key: 'email', title: 'Email' },
            { key: 'status', title: 'Status' }
          ],
          data: [],
          pagination: true,
          pageSize: 10
        },
        dataBindable: true
      },
      {
        id: 'chart',
        type: 'chart',
        title: 'Chart',
        icon: FiBarChart,
        description: 'Data visualization chart',
        category: 'data',
        defaultProps: {
          type: 'bar',
          data: [],
          title: 'Chart Title',
          width: '100%',
          height: 300
        },
        dataBindable: true
      },
      {
        id: 'metric',
        type: 'metric',
        title: 'Metric Display',
        icon: FiTrendingUp,
        description: 'Key metric display',
        category: 'data',
        defaultProps: {
          label: 'Total Users',
          value: '1,234',
          trend: '+12%',
          trendType: 'positive'
        },
        dataBindable: true
      }
    ]
  }
];
