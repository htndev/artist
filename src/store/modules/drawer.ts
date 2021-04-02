import store from '@/store';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

@Module({ dynamic: true, store, name: 'drawer', namespaced: true })
export class Drawer extends VuexModule {
  mini = false;
  expanded = true;
  isMobile = false;

  get drawerSettings(): { mini: boolean; expanded: boolean } {
    return this.isMobile
      ? {
          mini: false,
          expanded: this.expanded
        }
      : {
          mini: this.mini,
          expanded: true
        };
  }

  @Mutation
  MINIFY(): void {
    this.mini = true;
    this.expanded = false;
  }

  @Mutation
  EXPAND(): void {
    this.mini = false;
    this.expanded = true;
  }

  @Mutation
  SET_MOBILE(isMobile: boolean): void {
    this.isMobile = isMobile;
  }

  @Action
  initialize(isDesktop: boolean): () => void {
    // console.log(Platform);
    // this.SET_MOBILE(!Platform.is.desktop);
    return () => {
      this.SET_MOBILE(!isDesktop);

      if (this.isMobile) {
        this.MINIFY();
      }
    };
  }

  @Action
  toggle(): void {
    this.expanded ? this.MINIFY() : this.EXPAND();
  }
}

export const DrawerModule = getModule(Drawer);
