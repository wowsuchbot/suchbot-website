---
import { type NextRequest } from 'astro/server';
import { agentTasks } from '../../agent-tasks.json';

export async function POST(request: NextRequest) {
	const { targetAgent, taskDescription, priority } = await request.json();
	
	// Update agent-tasks.json
	try {
		// Read current tasks
		const { readFileSync } = await import('fs');
		let tasks = agentTasks;
		if (typeof tasks !== 'object') {
			tasks = { curator: [], researchAnalyst: [], writer: [] };
		}
		
		// Check if target agent exists in task structure
		if (tasks[targetAgent]) {
			if (Array.isArray(tasks[targetAgent])) {
				// Add new task to agent's task list
				const newTask = {
					id: `${targetAgent}-${Date.now()}`,
					title: `Trigger: ${taskDescription}`,
					description: taskDescription,
					priority,
					assignedTo: targetAgent,
					dependencies: [],
					status: 'pending'
				};
				tasks[targetAgent].push(newTask);
				
				// Write back updated tasks
				writeFileSync('../../agent-tasks.json', JSON.stringify(tasks, null, 2));
				
				return new Response(
					JSON.stringify({ success: true, message: `Task assigned to ${targetAgent}: ${taskDescription}` }),
					{ status: 200, headers: { 'Content-Type': 'application/json' } }
				);
			} else {
				// Create new agent entry if target doesn't exist
				tasks[targetAgent] = [{
					id: `${targetAgent}-${Date.now()}`,
					title: `Trigger: ${taskDescription}`,
					description: taskDescription,
					priority,
					assignedTo: targetAgent,
					dependencies: [],
					status: 'pending'
				}];
				
				// Write back updated tasks
				writeFileSync('../../agent-tasks.json', JSON.stringify(tasks, null, 2));
				
				return new Response(
					JSON.stringify({ success: true, message: `Task assigned to ${targetAgent}: ${taskDescription}` }),
					{ status: 200, headers: { 'Content-Type': 'application/json' } }
				);
			}
		} catch (error) {
		console.error('Error in trigger handler:', error);
		return new Response(
			JSON.stringify({ success: false, message: `Error: ${error}` }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
}
