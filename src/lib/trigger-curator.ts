---
import { agentTasks } from '../agent-tasks.json';

export const triggerCurator = async () => {
	const timestamp = new Date().toISOString();
	const message = `CURATOR: Start Museum of CryptoArt research project. Phase 1: Content extraction from MoCA blog (3+ years). Implement topic clustering and entity extraction. Document findings in research/moca/. Medium priority tasks: blog crawler, topic clustering, entity extraction, timeline. Report back when complete.`;

	console.log(`[${timestamp}] SESSION SEND to CURATOR: ${message}`);

	try {
		const { execSync } = await import('child_process');

		// Read current tasks
		let tasks = agentTasks;
		try {
			const tasksFile = '/root/.openclaw/workspace/memory/agent-tasks.json';
			const data = execSync(`cat ${tasksFile}`, { encoding: 'utf-8' });
			tasks = JSON.parse(data);
		} catch (error) {
			console.error(`Error reading agent-tasks.json: ${error}`);
		}

		// Check if Curator exists in task structure
		if (tasks.curator && Array.isArray(tasks.curator)) {
			console.log(`Agent CURATOR found in tasks.json`);
			const agentTasks_curator = tasks.curator;

			// Add new task to agent's task list
			const newTask = {
				id: `curator-start-moca-${Date.now()}`,
				title: `Start Museum of CryptoArt research project`,
				description: `Start Museum of CryptoArt research project. Phase 1: Content extraction from MoCA blog (3+ years). Implement topic clustering and entity extraction. Document findings in research/moca/. Medium priority tasks: blog crawler, topic clustering, entity extraction, timeline. Report back when complete.`,
				priority: 'high',
				assignedTo: 'curator',
				dependencies: [],
				status: 'pending'
			};
			agentTasks_curator.push(newTask);

			// Write back updated tasks
			execSync(`echo '${JSON.stringify(tasks, null, 2)}' > /root/.openclaw/workspace/memory/agent-tasks.json`, { encoding: 'utf-8' });

			console.log(`Task added to curator:`, newTask.id);
		} else {
			console.log(`Agent CURATOR not found in tasks.json. Creating new agent entry...`);

			tasks.curator = [{
				id: `curator-start-moca-${Date.now()}`,
				title: `Start Museum of CryptoArt research project`,
				description: `Start Museum of CryptoArt research project. Phase 1: Content extraction from MoCA blog (3+ years). Implement topic clustering and entity extraction. Document findings in research/moca/. Medium priority tasks: blog crawler, topic clustering, entity extraction, timeline. Report back when complete.`,
				priority: 'high',
				assignedTo: 'curator',
				dependencies: [],
				status: 'pending'
			}];

			execSync(`echo '${JSON.stringify(tasks, null, 2)}' > /root/.openclaw/workspace/memory/agent-tasks.json`, { encoding: 'utf-8' });

			console.log(`Agent curator entry created with trigger task`);
		}

		console.log(`[${timestamp}] Task assigned to CURATOR. Priority: high`);
		return { success: true, message: `Task assigned to curator` };

	} catch (error) {
		console.error(`Error in triggerCurator: ${error}`);
		return { success: false, message: `Error: ${error}` };
	}
};
