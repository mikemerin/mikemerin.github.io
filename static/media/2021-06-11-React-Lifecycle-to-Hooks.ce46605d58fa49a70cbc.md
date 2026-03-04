---
layout: post
title: "Convert React Lifecycle Methods to Hooks"
subtitle: "functional is the new class"
date: 2021-06-11 19:01:42 -0400
tags: React, Hooks
series: React Hooks
summary: Functional components use hooks
---
While the old method of working with React used class components, functional components with hooks are the current (and frankly easier) way to control your application. Here's what you'll be using 90% of the time:

```ts
/* class ComponentName {} */
const ComponentName = (props) => {};

/* constructor */
const [state, setState] = useState(props);

/* componentDidMount */
useEffect (() => {}, []);
// empty array (don't look at anything, just do this once)

/* componentDidUpdate */
useEffect (() => {}, [any, number, of, props, or, attributes]);
// look at anything in the array

/* componentWillUnmount */
useEffect (() => () => { return {} }, []);
// empty array (hold this for me until I'm done)
```

All together, here's a before and after:

Before:
```ts
class ComponentName extends React.Component {
    constructor(props) {
        super(props);
        this.state = props;
    }

    componentDidMount() {
        console.log('Mounted');
    }

    componentWillUnmount() {
        console.log('Unmounted');
    }

    componentDidUpdate(prevProps) {
        if (this.props.item !== prevProps.item) {
            console.log('Updated item');
        }
        if (
            this.props.one !== prevProps.one ||
            this.props.of !== prevProps.of ||
            this.props.these !== prevProps.these
        ) {
            console.log('Updated one of these');
        }
    }
}
```

After
```ts
const ComponentName = (props) => {
    const [state, setState] = useState(props);

    useEffect(() => {
        console.log('Mounted');
        return () => {
            console.log('Unmounted');
        }
    }, []);

    useEffect(() => {
        console.log('Updated item');
    }, [props.item]);

    useEffect(() => {
        console.log('Updated one of these');
    }, [props.one, props.of, props.these]);
};

```

Code on.

-Mike Merin
