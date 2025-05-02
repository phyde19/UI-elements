# Compass

## What is Compass. What are we prototyping?

We are going to iterate on a design for an AI chat application called Compass. It will eventually be implemented
likey as a fullstack typescript app using some mix of technologies like:

- tRPC
- Vite or Next.js (app router)
- zustand
- zod 
- drizzle
- and more...


The vision is to create a corporate "compass" that gives individual teams within an enterprize organization a powerful AI interface to their unique data and systems. 
Stated with less corporate jargon, this is an application that provides an AI chat
interface with agentic and workflow access to tool and resource connectors to a teams data, software, and systems. 

At a high level, we're planning to implement this with two data model primitives
1. Workspaces - Each team gets a workspace. Users may belong to multiple workspaces but this will be rare. Workspaces are like namespaces that defined the AI functionality available for a team.
2. Plugins - Plugins define specific mutually exclusive (one plugin at a time) AI features or chat contexts that are available in a particualar workspace. Plugins can be distributed in more than one workspace. As an example you might have a RAG plugin for the legal teams that allows Q/A over and internal documentation repo. Then a data engineering team might have a plugin to chat with an AI to query databases. 

Update. The mental model has changed:
The project manager recently changed this a bit. We're still using
the word workspaces but the mental model has changed. Previously a workspace was synonymous with a team or user
group and plugins would be distributed to those user groups. To improve flexibilty the new model is that a
workspace is simple a "plugin" group. This allows users to customize granularly what plugins they have access to
by requesting a new workspace to gain access to a new set of plugins. The distinction is that previously you
would think about adding a plugin to your teams workspace but now you think on a user level and would instead
request the workspace you need with is really more like a plugin group. This also means that plugins are many : 1
with workspaces now. Previously many : many. Does that make sense?

Every plugin will have a running chat interface that works exactly as you expect from precedant set by apps like ChatGPT, Anthropic Claude, etc. 

Crucially some plugins will also require a right hand side expandable panel for working with certain artifacts. This could contain everything from a document that the user can iterate on alongs side the AI (left hand main chat would have to collapse/narror) to some input fields that a plugin requires. 

-----------------------------------------------------

## So what are we going to work on?

I want us to relax any requirement to attempt a functionally robust working prototype. For this session, our goal is to reach into creative design mental spaces, and craft a compelling and modern UX visual interface. We are *designing in code*. 

To optimize this workflow, I think we should build in a framework that you know well. Something that will most naturally allow you to express your ideas. 
For this reason I suggest we use Next.js 14, typescript, tailwind. 

IMPORTANT: we won't need to be concerned with UI state solutions or tanstack query or anything. We are completely focused on frontend UI design. 