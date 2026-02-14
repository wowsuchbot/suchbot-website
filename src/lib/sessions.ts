---
import { agentTasks } from '../agent-tasks.json';

export const sessions_send = async (targetAgent: string, taskDescription: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
  const timestamp = new Date().toISOString();
  const message = `${targetAgent.toUpperCase()}: ${taskDescription}`;

  console.log(`[${timestamp}] SESSION SEND to ${targetAgent}: ${message}`);

  // Check if agent-tasks.json exists, create if not
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

    // Check if target agent exists in task structure
    if (targetAgent in tasks) {
      console.log(`Agent ${targetAgent} found in tasks.json`);
      const agentTasks = tasks[targetAgent];
      if (Array.isArray(agentTasks)) {
        // Add new task to agent's task list
        const newTask = {
          id: `${targetAgent}-trigger-${Date.now()}`,
          title: `Trigger: ${taskDescription}`,
          description: taskDescription,
          priority,
          assignedTo: targetAgent,
          dependencies: [],
          status: 'pending'
        };
        agentTasks.push(newTask);
        
        // Write back updated tasks
        execSync(`echo '${JSON.stringify(tasks, null, 2)}' > /root/.openclaw/workspace/memory/agent-tasks.json`, { encoding: 'utf-8' });
        
        console.log(`Task added to ${targetAgent}:`, newTask.id);
      }
    } else {
      console.log(`Agent ${targetAgent} not found in tasks.json. Creating new agent entry...`);
      
      tasks[targetAgent] = [{
        id: `${targetAgent}-trigger-${Date.now()}`,
        title: `Trigger: ${taskDescription}`,
        description: taskDescription,
        priority,
        assignedTo: targetAgent,
        dependencies: [],
        status: 'pending'
      }];
      
      execSync(`echo '${JSON.stringify(tasks, null, 2)}' > /root/.openclaw/workspace/memory/agent-tasks.json`, { encoding: 'utf-8' });
      
      console.log(`Agent ${targetAgent} entry created with trigger task`);
    }

    console.log(`[${timestamp}] Task assigned to ${targetAgent}. Priority: ${priority}`);
    return { success: true, message: `Task assigned to ${targetAgent}` };
    
  } catch (error) {
    console.error(`Error in sessions_send: ${error}`);
    return { success: false, message: `Error: ${error}` };
  }
};
