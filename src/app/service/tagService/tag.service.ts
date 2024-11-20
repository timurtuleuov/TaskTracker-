import { Injectable, Injector } from '@angular/core';
import { Tag } from '../../interface/tag.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { TaskService } from '../task.service';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private readonly localStorageKey = 'tags';
  private tags$ = new BehaviorSubject<Tag[]>(this.getTags());

  constructor(private injector: Injector) {}

  // Retrieve tags from localStorage
  private getTags(): Tag[] {
    const tagsString = localStorage.getItem(this.localStorageKey);
    return tagsString ? JSON.parse(tagsString) : [];
  }

  // Save tags to localStorage and update the observable
  private saveTags(tags: Tag[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(tags));
    this.tags$.next(tags);
  }

  // Get all tags as an observable
  getAllTags(): Observable<Tag[]> {
    return this.tags$.asObservable();
  }

  // Add a new tag if it doesn't already exist (checks by title)
  addTag(newTag: Tag): void {
    const tags = this.getTags();
    if (!tags.some(tag => tag.title === newTag.title)) { // Avoid duplicates by title
      tags.push(newTag);
      this.saveTags(tags);
    }
  }

  // Delete a tag by id and remove it from associated tasks
  deleteTag(tagId: string): void {
    let tags = this.getTags();
    const tagToDelete = tags.find(tag => tag.id === tagId);
    if (tagToDelete) {
      tags = tags.filter(tag => tag.id !== tagId);
      this.saveTags(tags);

      // Remove the tag from all tasks
      const taskService = this.getTaskService();
      taskService.removeTagFromTasks(tagToDelete.title);
    }
  }

  // Update an existing tag's title based on id
  updateTag(tagId: string, newTitle: string): void {
    let tags = this.getTags();
    const index = tags.findIndex(tag => tag.id === tagId);
    if (index !== -1) {
      tags[index].title = newTitle;
      this.saveTags(tags);
    }
  }

  // Lazy load TaskService only when needed
  private getTaskService(): TaskService {
    return this.injector.get(TaskService);
  }
}