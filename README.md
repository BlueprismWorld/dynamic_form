# Dynamic Form Renderer

A powerful, extensible React component library for rendering forms dynamically from JSON schema. Built with TypeScript, Tailwind CSS, and Next.js.

## Features

- 🔧 **JSON Schema-based**: Define forms using JSON configuration
- 📝 **TypeScript Support**: Full type safety and IntelliSense
- 🎨 **Tailwind CSS**: Beautiful, responsive styling out of the box
- 🔄 **Form State Management**: Built-in state handling with React Context
- ✅ **Validation System**: Comprehensive validation with custom rules
- 🎯 **Conditional Rendering**: Show/hide fields based on form data
- 📱 **Responsive Design**: Mobile-first approach
- 🎯 **Extensible**: Easy to add new component types
- 🔌 **API Integration**: Fetch dropdown options from external APIs
- 🎨 **Custom Styling**: Support for custom CSS classes and inline styles

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Basic Usage

```tsx
import { FormRenderer } from './components/core/FormRenderer';

const schema = {
  title: 'Contact Form',
  components: [
    {
      id: 'name',
      type: 'text',
      name: 'name',
      label: 'Full Name',
      required: true,
      validation: [
        { type: 'required', message: 'Name is required' }
      ]
    },
    {
      id: 'email',
      type: 'email',
      name: 'email',
      label: 'Email',
      required: true,
      validation: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Invalid email format' }
      ]
    },
    {
      id: 'submit',
      type: 'button',
      label: 'Submit',
      variant: 'primary',
      buttonType: 'submit'
    }
  ],
  onSubmit: (data) => {
    console.log('Form submitted:', data);
  }
};

export default function MyForm() {
  return <FormRenderer schema={schema} />;
}
```

## Available Components

### Form Input Components
- **TextInput**: text, email, password, number, date, time, datetime inputs
- **TextareaInput**: Multi-line text input with resize options
- **SelectInput**: Dropdown with options or API data source
- **RadioInput**: Single selection from multiple options
- **CheckboxInput**: Single or multiple checkboxes
- **FileInput**: File upload with drag & drop and validation

### UI Components
- **Button**: Customizable button with variants and loading states
- **Tabs**: Tabbed interface with nested form components
- **Stepper**: Multi-step wizard interface
- **Accordion**: Collapsible content panels (coming soon)
- **Card**: Card layout component (coming soon)
- **Modal**: Modal dialog component (coming soon)
- **Table**: Data table component (coming soon)
- **ProgressBar**: Progress indicator (coming soon)
- **Notification**: Toast/alert messages (coming soon)
- **Badge**: Status badges (coming soon)
- **Breadcrumbs**: Navigation breadcrumbs (coming soon)
- **Chips**: Tag/chip components (coming soon)
- **Tooltip**: Hover tooltips (coming soon)
- **Grid**: Layout grid system (coming soon)

## Key Features

### Validation System
Built-in validation with support for:
- Required fields
- Email format validation
- Min/max length validation
- Pattern matching
- Custom validation functions

### Conditional Rendering
Show/hide components based on form data:
```tsx
{
  id: 'companyName',
  type: 'text',
  name: 'companyName',
  label: 'Company Name',
  visibleIf: {
    field: 'employmentStatus',
    operator: 'equals',
    value: 'employed'
  }
}
```

### API Integration
Fetch dropdown options from external APIs:
```tsx
{
  id: 'country',
  type: 'select',
  name: 'country',
  label: 'Country',
  dataSource: {
    url: 'https://api.example.com/countries',
    valueField: 'code',
    labelField: 'name'
  }
}
```

### Custom Styling
Support for custom CSS classes and inline styles:
```tsx
{
  id: 'styledInput',
  type: 'text',
  name: 'styledInput',
  label: 'Custom Styled Input',
  className: 'custom-input-class',
  style: {
    backgroundColor: '#f0f8ff',
    borderRadius: '8px'
  }
}
```

## Development

The project follows Next.js best practices and is fully typed with TypeScript. Components are organized in:
- `src/components/core/` - Core form logic
- `src/components/form-inputs/` - Form input components
- `src/components/ui/` - UI components
- `src/lib/types/` - TypeScript definitions
- `src/lib/utils/` - Utility functions

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
