from graphviz import Digraph

dfd = Digraph(format='png', engine='dot')

# Set the graph attributes
dfd.attr(rankdir='LR', bgcolor='white')

# External Entities
dfd.node('Users', 'Users', shape='box', style='rounded,filled', color='lightblue', fontsize='12')
dfd.node('Admins', 'Admins', shape='box', style='rounded,filled', color='lightblue', fontsize='12')

# Processes
dfd.node('1.1', 'Register/Login', shape='circle', style='filled', color='lightgrey', fontsize='12')
dfd.node('1.2', 'Team Management', shape='circle', style='filled', color='lightgrey', fontsize='12')
dfd.node('1.3', 'Project Management', shape='circle', style='filled', color='lightgrey', fontsize='12')
dfd.node('1.4', 'Event Management', shape='circle', style='filled', color='lightgrey', fontsize='12')
dfd.node('1.5', 'News & Updates', shape='circle', style='filled', color='lightgrey', fontsize='12')

# Data Stores
dfd.node('D1', 'Users Table', shape='box', style='dashed', fontsize='10', color='grey')
dfd.node('D2', 'Teams Table', shape='box', style='dashed', fontsize='10', color='grey')
dfd.node('D3', 'Projects Table', shape='box', style='dashed', fontsize='10', color='grey')
dfd.node('D4', 'Events Table', shape='box', style='dashed', fontsize='10', color='grey')
dfd.node('D5', 'News Table', shape='box', style='dashed', fontsize='10', color='grey')

# Connections
dfd.edge('Users', '1.1', label='User Credentials', fontsize='10')
dfd.edge('1.1', 'D1', label='Store User Info', fontsize='10')
dfd.edge('1.1', 'Users', label='Login Status', fontsize='10')

dfd.edge('Users', '1.2', label='Create/Join Teams', fontsize='10')
dfd.edge('1.2', 'D2', label='Update Teams', fontsize='10')
dfd.edge('D2', '1.2', label='Team Details', fontsize='10')

dfd.edge('Users', '1.3', label='Add/Update Projects', fontsize='10')
dfd.edge('1.3', 'D3', label='Update Projects', fontsize='10')
dfd.edge('D3', '1.3', label='Project Details', fontsize='10')

dfd.edge('Admins', '1.4', label='Create Events', fontsize='10')
dfd.edge('Users', '1.4', label='View Events', fontsize='10')
dfd.edge('1.4', 'D4', label='Store Events', fontsize='10')
dfd.edge('D4', '1.4', label='Event Details', fontsize='10')

dfd.edge('Admins', '1.5', label='Post News', fontsize='10')
dfd.edge('Users', '1.5', label='View News', fontsize='10')
dfd.edge('1.5', 'D5', label='Update News', fontsize='10')
dfd.edge('D5', '1.5', label='News Details', fontsize='10')

# Render the graph
dfd.render('level_2_dfd_diagram')
print("DFD diagram generated as 'level_2_dfd_diagram.png'")
