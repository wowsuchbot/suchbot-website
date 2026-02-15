---
import { type NextRequest } from 'astro/server';
import { agentTasks } from '../../agent-tasks.json';

export async function POST(request: NextRequest) {
	const { targetAgent, taskDescription, priority } = await request.json();

	console.log(`Writer trigger: ${targetAgent}, ${taskDescription}`);

	// Update agent-tasks.json
	try {
		const { readFileSync, writeFileSync } = await import('fs');
		let tasks = agentTasks;
		if (typeof tasks !== 'object') {
			tasks = { curator: [], researchAnalyst: [], writer: [] };
		}
		
		// Check if writer agent exists in task structure
		if (tasks.writer && Array.isArray(tasks.writer)) {
			// Add new task to writer's task list
			const newTask = {
				id: `writer-${targetAgent}-${Date.now()}`,
				title: `Trigger: ${taskDescription}`,
				description: taskDescription,
				priority,
				assignedTo: 'writer',
				dependencies: [],
				status: 'pending'
			};
			tasks.writer.push(newTask);
			
			// Write back updated tasks
			writeFileSync('../../agent-tasks.json', JSON.stringify(tasks, null, 2));
			
			console.log(`Task added to writer:`, newTask.id);
			
			return new Response(
				JSON.stringify({ success: true, message: `Task assigned to ${targetAgent}: ${taskDescription}` }),
				{ status: 200, headers: { 'Content-Type': 'application/json' } }
			);
		} else {
			// Create new agent entry if writer doesn't exist
			tasks.writer = [{
				id: `writer-${targetAgent}-${Date.now()}`,
				title: `Trigger: ${taskDescription}`,
				description: taskDescription,
				priority,
				assignedTo: 'writer',
				dependencies: [],
				status: 'pending'
			}];
			
			// Write back updated tasks
			writeFileSync('../../agent-tasks.json', JSON.stringify(tasks, null, 2));
			
			console.log(`Writer agent entry created with trigger task:`, tasks.writer[0].id);
			
			return new Response(
				JSON.stringify({ success: true, message: `Task assigned to ${targetAgent}: ${taskDescription}` }),
				{ status: 200, headers: { 'Content-Type': 'application/json' } }
			);
		}
	} catch (error) {
		console.error('Error in writer trigger handler:', error);
		return new Response(
			JSON.stringify({ success: false, message: `Error: ${error}` }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
}
