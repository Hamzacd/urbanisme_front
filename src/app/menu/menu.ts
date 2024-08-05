import { CoreMenu } from '@core/types'

export const menu: CoreMenu[] = [
  {
    id: 'home',
    title: 'Tableau de bord',
    translate: 'MENU.HOME',
    role: ['admin'],
    type: 'item',
    icon: 'home',
    url: 'dashboard'
  },
  {
    id: 'user',
    title: 'Utilisateurs',
    translate: 'MENU.USER.COLLAPSIBLE',
    type: 'collapsible',
    icon: 'user-check',
    role: ['admin'], 
    children: [
      {
        id: 'list_users',
        title: 'List',
        translate: 'MENU.USER.LIST',
        type: 'item',
        icon: 'circle',
        url: 'users/list'
      },
      {
        id: 'add_user',
        title: 'Add',
        translate: 'MENU.USER.ADD',
        type: 'item',
        icon: 'circle',
        url: 'users/add'
      }
    ]
  }, 
  {
    id: 'CONSTRUCTION',
    title: 'Construction',
    translate: 'MENU.CONSTRUCTION.COLLAPSIBLE',
    type: 'collapsible',
    icon: 'tool',
    role: ['admin','manager'], 
    children: [
      {
        id: 'list_construction',
        title: 'List',
        translate: 'MENU.CONSTRUCTION.LIST',
        type: 'item',
        icon: 'circle',
        url: 'urb_requests/list/Construction'
      },
      {
        id: 'add_construction',
        title: 'Add',
        translate: 'MENU.CONSTRUCTION.ADD',
        type: 'item',
        icon: 'circle',
        role: ['manager'],
        url: 'urb_requests/add/Construction'
      }
    ]
  },
  {
    id: 'REPARATION',
    title: 'Réparation',
    translate: 'MENU.REPARATION.COLLAPSIBLE',
    type: 'collapsible',
    icon: 'tool',
    role: ['admin','manager'], 
    children: [
      {
        id: 'list_reparation',
        title: 'List',
        translate: 'MENU.REPARATION.LIST',
        type: 'item',
        icon: 'circle',
        url: 'urb_requests/list/Rréparation'
      },
      {
        id: 'add_reparation',
        title: 'Add',
        translate: 'MENU.REPARATION.ADD',
        type: 'item',
        icon: 'circle',
        role: ['manager'],
        url: 'urb_requests/add/Rréparation'
      }
    ]
  },

  {
    id: 'LOTISSEMENT',
    title: 'Lotissement',
    translate: 'MENU.LOTISSEMENT.COLLAPSIBLE',
    type: 'collapsible',
    icon: 'table',
    role: ['admin','manager'], 
    children: [
      {
        id: 'list_Lotissement',
        title: 'List',
        translate: 'MENU.LOTISSEMENT.LIST',
        type: 'item',
        icon: 'circle',
        url: 'urb_requests/list/Lotissement'
      },
      {
        id: 'add_Lotissement',
        title: 'Add',
        translate: 'MENU.LOTISSEMENT.ADD',
        type: 'item',
        icon: 'circle',
        role: ['manager'],
        url: 'urb_requests/add/Lotissement'
      }
    ]
  },
  {
    id: 'HABITER',
    title: 'Permis d’habiter',
    translate: 'MENU.HABITER.COLLAPSIBLE',
    type: 'collapsible',
    icon: 'archive',
    role: ['admin','manager'], 
    children: [
      {
        id: 'list_habiter',
        title: 'List',
        translate: 'MENU.HABITER.LIST',
        type: 'item',
        icon: 'circle',
        url: 'urb_requests/list/Permis d’habiter'
      },
      {
        id: 'add_Phabiter',
        title: 'Add',
        translate: 'MENU.HABITER.ADD',
        type: 'item',
        icon: 'circle',
        role: ['manager'],
        url: 'urb_requests/add/Permis d’habiter'
      }
    ]
  },









  
]


