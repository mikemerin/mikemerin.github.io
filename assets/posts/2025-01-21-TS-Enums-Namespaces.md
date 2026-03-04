---
layout: post
title: "TypeScript Enums: Organizing with Namespaces"
date: 2025-01-21 14:00:00 -0400
tags: TypeScript
series: Mastering Types
summary: Keep your enums organized and prevent naming conflicts
---

As your TypeScript application grows, managing multiple enums becomes challenging. Namespaces solve this by organizing related enums together, similar to how packages work in other languages.

## The Problem: Namespace Pollution

Without organization, your enums can collide:

```ts
// In file1.ts
enum Status {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

// In file2.ts
enum Status {  // ❌ Conflict!
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}

// Which Status are you using?
const status: Status = Status.PENDING;  // Ambiguous!
```

## Solution: Namespaces

TypeScript namespaces group related code together:

```ts
namespace Blog {
  export enum Status {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED'
  }
}

namespace User {
  export enum Status {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    PENDING = 'PENDING'
  }
}

// Now there's no conflict
const blogStatus: Blog.Status = Blog.Status.PUBLISHED;
const userStatus: User.Status = User.Status.ACTIVE;
```

## Organizing Multiple Enums

When you have several related enums, group them in a namespace:

```ts
namespace Divisions {
  export enum Department {
    ENGINEERING = 'Engineering',
    PRODUCT = 'Product',
    DESIGN = 'Design',
    MARKETING = 'Marketing'
  }

  export enum Level {
    JUNIOR = 'Junior',
    SENIOR = 'Senior',
    LEAD = 'Lead',
    MANAGER = 'Manager'
  }

  export enum Employment {
    FULL_TIME = 'Full-Time',
    PART_TIME = 'Part-Time',
    CONTRACTOR = 'Contractor'
  }
}

// Usage
const dept = Divisions.Department.ENGINEERING;
const level = Divisions.Level.SENIOR;
const employment = Divisions.Employment.FULL_TIME;
```

## String vs Numeric Enums in Namespaces

Both types work equally well in namespaces:

```ts
namespace Colors {
  // String enum - more readable
  export enum Status {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
  }

  // Numeric enum - lightweight
  export enum Priority {
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3
  }
}

const status = Colors.Status.ACTIVE;    // 'ACTIVE'
const priority = Colors.Priority.HIGH;  // 3
```

## Nested Namespaces

For complex applications, you can nest namespaces:

```ts
namespace App {
  namespace Blog {
    export enum PostStatus {
      DRAFT = 'DRAFT',
      PUBLISHED = 'PUBLISHED'
    }

    export enum Category {
      REACT = 'React',
      TYPESCRIPT = 'TypeScript',
      JAVASCRIPT = 'JavaScript'
    }
  }

  namespace Admin {
    export enum Permission {
      READ = 'read',
      WRITE = 'write',
      DELETE = 'delete'
    }

    export enum Role {
      ADMIN = 'Admin',
      EDITOR = 'Editor',
      VIEWER = 'Viewer'
    }
  }
}

// Usage
const postStatus = App.Blog.PostStatus.PUBLISHED;
const permission = App.Admin.Permission.WRITE;
```

## Combining Enums and Types

Namespaces work great with types and interfaces too:

```ts
namespace User {
  export enum Role {
    ADMIN = 'admin',
    USER = 'user',
    GUEST = 'guest'
  }

  export interface Profile {
    id: string;
    name: string;
    role: Role;
    status: Status;
  }

  export enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended'
  }
}

// Usage
const user: User.Profile = {
  id: '123',
  name: 'Mike',
  role: User.Role.ADMIN,
  status: User.Status.ACTIVE
};
```

## Real-World Example: API Response Handler

```ts
namespace API {
  export enum Method {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
  }

  export enum Status {
    SUCCESS = 'success',
    ERROR = 'error',
    LOADING = 'loading'
  }

  export interface Response<T> {
    status: Status;
    data?: T;
    error?: string;
  }

  export enum ErrorCode {
    NOT_FOUND = 404,
    UNAUTHORIZED = 401,
    SERVER_ERROR = 500,
    BAD_REQUEST = 400
  }
}

// Using it
const handleResponse = <T>(response: API.Response<T>) => {
  switch (response.status) {
    case API.Status.SUCCESS:
      console.log('Success!', response.data);
      break;
    case API.Status.ERROR:
      console.error('Error:', response.error);
      break;
    case API.Status.LOADING:
      console.log('Loading...');
      break;
  }
};
```

## Using keyof with Namespaced Enums

Remember [keyof and typeof](/blog?post=2025-01-15-Keyof-Typeof-Deep-Dive)? They work great with namespaces:

```ts
namespace Colors {
  export enum Status {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
  }
}

type StatusKey = keyof typeof Colors.Status;
// type StatusKey = 'ACTIVE' | 'INACTIVE'

const getStatusDescription = (key: StatusKey): string => {
  const descriptions: Record<StatusKey, string> = {
    ACTIVE: 'The item is currently active',
    INACTIVE: 'The item is disabled'
  };
  return descriptions[key];
};
```

## Exporting from a Module

For large projects, organize namespaces in separate files:

```ts
// enums.ts
export namespace UI {
  export enum Theme {
    LIGHT = 'light',
    DARK = 'dark'
  }

  export enum Size {
    SMALL = 'sm',
    MEDIUM = 'md',
    LARGE = 'lg'
  }
}

// component.tsx
import { UI } from './enums';

const Button = (theme: UI.Theme, size: UI.Size) => {
  // Component code
};
```

## When NOT to Use Namespaces

Modern TypeScript often uses modules instead of namespaces. This is the recommended approach:

```ts
// Modern approach (preferred)
// status.ts
export enum BlogStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}

// types.ts
export interface Post {
  status: BlogStatus;
}

// usage.ts
import { BlogStatus } from './status';
import { Post } from './types';
```

vs

```ts
// Old approach (still valid but less common)
namespace Blog {
  export enum Status { /* ... */ }
  export interface Post { /* ... */ }
}
```

## Best Practices

1. **Use namespaces for logical grouping** at the module level
2. **Prefer modern modules** for large applications
3. **Keep namespace nesting shallow** (usually 1-2 levels)
4. **Export explicitly** what should be public
5. **Combine with types** for complete domain models
6. **Use consistent naming** for your namespaces

## Summary

- Namespaces prevent enum naming conflicts
- Organize related enums together logically
- Can be nested for deeper organization
- Work well with types and interfaces
- Combine with `keyof typeof` for advanced typing
- Modern applications often prefer ES modules instead
- Keep them simple and well-organized

Namespaces are a powerful organizational tool, especially as your TypeScript codebase grows. Use them to create clear boundaries and prevent naming collisions, making your code more maintainable and easier for teams to navigate.

Code on.

-Mike Merin
