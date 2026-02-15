---
import { type NextRequest } from 'astro/server';
import { agentTasks } from '../../agent-tasks.json';

export async function POST(request: NextRequest) {
	const { targetAgent, taskDescription, priority } = await request.json();

	console.log(`Z.AI MCP Integration: ${targetAgent}, ${taskDescription}`);

	// Update agent-tasks.json
	try {
		const { readFileSync, writeFileSync } = await import('fs');
		let tasks = agentTasks;
		if (typeof tasks !== 'object') {
			tasks = { curator: [], researchAnalyst: [], writer: [] };
		}

		// Create new task for target agent
		if (tasks[targetAgent]) {
			if (Array.isArray(tasks[targetAgent])) {
				// Add new task to agent's task list
				const newTask = {
					id: `zai-mcp-${targetAgent}-${Date.now()}`,
					title: `Research Z.AI MCP capabilities: ${taskDescription}`,
					description: `Investigate Z.AI MCP servers (vision-mcp, search-mcp, reader-mcp). Document capabilities, API endpoints, authentication methods. Create suchbot integration for vision, search, and web reading. Update TOPICS.md and PEOPLE.md with Z.AI ecosystem entities and tools.`,
					priority,
					assignedTo: targetAgent,
					dependencies: [],
					status: 'pending'
				};
				tasks[targetAgent].push(newTask);

				// Write back updated tasks
				writeFileSync('../../agent-tasks.json', JSON.stringify(tasks, null, 2));
				
				console.log(`Task added to ${targetAgent}:`, newTask.id);
			} else {
				// Create new agent entry if target doesn't exist
				tasks[targetAgent] = [{
					id: `zai-mcp-${targetAgent}-${Date.now()}`,
					title: `Research Z.AI MCP capabilities: ${taskDescription}`,
					description: `Investigate Z.AI MCP servers (vision-mcp, search-mcp, reader-mcp). Document capabilities, API endpoints, authentication methods. Create suchbot integration for vision, search, and web reading. Update TOPICS.md and PEOPLE.md with Z.AI ecosystem entities and tools.`,
					priority,
					assignedTo: targetAgent,
					dependencies: [],
					status: 'pending'
				}];
				
				// Write back updated tasks
				writeFileSync('../../agent-tasks.json', JSON.stringify(tasks, null, 2));
				
				console.log(`Agent ${targetAgent} entry created with zai-mcp task:`, tasks[targetAgent][0].id);
			}

		console.log(`[${new Date().toISOString()}] Task assigned to ${targetAgent}. Priority: ${priority}`);
		return new Response(
			JSON.stringify({ success: true, message: `Task assigned to ${targetAgent}: Research Z.AI MCP capabilities` }),
			{ status: 200, headers: { 'Content-Type': 'application/json' } }
		);
	} catch (error) {
		console.error('Error in zai mcp handler:', error);
		return new Response(
			JSON.stringify({ success: false, message: `Error: ${error}` }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
}
