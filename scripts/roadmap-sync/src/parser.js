/**
 * Roadmap Parser Module
 * ===================
 * 
 * Provides functionality for parsing structured markdown roadmap files.
 * Extracts epics, tasks, subtasks, and their metadata from markdown content.
 * 
 * @module parser
 */

import fs from 'fs';
import path from 'path';
import { log } from '../utils/logger.js';
import { CONFIG } from '../config/config.js';

/**
 * Extract metadata from HTML comments in the roadmap file.
 * Looks for key-value pairs in HTML comments before and after the current line.
 * 
 * @param {string[]} lines - Array of lines from the roadmap file
 * @param {number} lineIndex - Index of the current line being processed
 * @returns {Object} Metadata object with extracted key-value pairs
 */
export function extractMetadata(lines, lineIndex) {
  const metadata = { ...CONFIG.defaults };
  
  const checkLine = (line) => {
    const match = line.match(/<!--\s*(.*?)\s*-->/);
    if (match) {
      const commentContent = match[1];
      // Extract key:value pairs
      const pairs = commentContent.split(/\s+/);
      pairs.forEach(pair => {
        const [key, value] = pair.split(':');
        if (key && value) {
          metadata[key.trim()] = value.trim();
        }
      });
    }
  };
  
  // Check the line before and the line after
  if (lineIndex > 0) checkLine(lines[lineIndex - 1]);
  if (lineIndex < lines.length - 1) checkLine(lines[lineIndex + 1]);
  
  return metadata;
}

/**
 * Parse the roadmap file and extract structured data.
 * Processes epics, tasks, and subtasks, including their metadata and relationships.
 * 
 * @param {string} filePath - Path to the roadmap markdown file
 * @returns {Object} Structured roadmap data with epics, tasks, and subtasks
 * @throws {Error} If required elements are missing or malformed
 */
export function parseRoadmap(filePath) {
  log.header('Parsing roadmap file...');
  
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  const roadmap = {
    epics: [],
  };
  
  let currentEpic = null;
  let currentTask = null;
  let currentSubtask = null;
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) return;
    
    // Epic
    if (line.startsWith('## Epic:')) {
      const epicName = line.substring(8).trim();
      const epicKey = lines[index + 2]?.match(/\*\*Key\*\*:\s*(.+)/)?.[1];
      
      if (!epicKey) {
        log.error(`Epic "${epicName}" is missing a key!`);
        process.exit(1);
      }
      
      currentEpic = {
        name: epicName,
        key: epicKey,
        description: '',
        tasks: [],
      };
      
      roadmap.epics.push(currentEpic);
      log.epic(`Found Epic: ${epicName} (${epicKey})`);
      return;
    }
    
    // Epic description
    if (currentEpic && line.startsWith('**Description**:')) {
      currentEpic.description = line.substring(15).trim();
      return;
    }
    
    // Task
    if (line.startsWith('### Task:')) {
      if (!currentEpic) {
        log.error('Found task outside of epic!');
        process.exit(1);
      }
      
      const taskName = line.substring(9).trim();
      currentTask = {
        name: taskName,
        description: '',
        acceptanceCriteria: [],
        technicalNotes: [],
        subtasks: [],
        metadata: extractMetadata(lines, index),
      };
      
      currentEpic.tasks.push(currentTask);
      log.task(`Found Task: ${taskName}`);
      return;
    }
    
    // Task description
    if (currentTask && line.startsWith('**Description**:')) {
      currentTask.description = line.substring(15).trim();
      return;
    }
    
    // Acceptance Criteria
    if (currentTask && line.startsWith('**Acceptance Criteria**:')) {
      let i = index + 1;
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        const criteria = lines[i].trim().substring(2);
        if (!criteria.startsWith('[')) { // Skip already completed items
          currentTask.acceptanceCriteria.push(criteria);
        }
        i++;
      }
      return;
    }
    
    // Technical Notes
    if (currentTask && line.startsWith('**Technical Notes**:')) {
      let i = index + 1;
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        currentTask.technicalNotes.push(lines[i].trim().substring(2));
        i++;
      }
      return;
    }
    
    // Subtask
    if (line.startsWith('#### Subtask:')) {
      if (!currentTask) {
        log.error('Found subtask outside of task!');
        process.exit(1);
      }
      
      const subtaskName = line.substring(12).trim();
      currentSubtask = {
        name: subtaskName,
        steps: [],
        metadata: extractMetadata(lines, index),
      };
      
      currentTask.subtasks.push(currentSubtask);
      log.subtask(`Found Subtask: ${subtaskName}`);
      return;
    }
    
    // Subtask steps
    if (currentSubtask && line.trim().startsWith('- ')) {
      const step = line.trim().substring(2);
      if (!step.startsWith('[')) { // Skip already completed items
        currentSubtask.steps.push(step);
      }
    }
  });
  
  return roadmap;
}
