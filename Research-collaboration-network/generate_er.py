from graphviz import Digraph

def generate_er_diagram():
    # Create a new directed graph
    er = Digraph('ER', filename='er_diagram')
    er.attr(rankdir='TB')  # Top to bottom layout
    
    # Node styling
    er.attr('node', shape='box', style='filled', fillcolor='lightgrey')
    
    # Create entities (rectangles)
    er.node('User', 'USER')
    er.node('Project', 'PROJECT')
    er.node('Team', 'TEAM')
    er.node('Paper', 'PAPER')
    er.node('Comment', 'COMMENT')
    er.node('Notification', 'NOTIFICATION')
    er.node('TeamInvitation', 'TEAM_INVITATION')
    er.node('Conference', 'CONFERENCE')
    er.node('Registration', 'REGISTRATION')
    
    # Relationship styling (diamonds)
    er.attr('node', shape='diamond', style='filled,diagonals', fillcolor='white')
    
    # Create relationships
    er.node('Works_On', 'WORKS_ON')
    er.node('Member_Of', 'MEMBER_OF')
    er.node('Manages', 'MANAGES')
    er.node('Authors', 'AUTHORS')
    er.node('Comments_On', 'COMMENTS_ON')
    er.node('Receives', 'RECEIVES')
    er.node('Invites', 'INVITES')
    er.node('Presents_At', 'PRESENTS_AT')
    er.node('Registers_For', 'REGISTERS_FOR')
    
    # Attribute styling
    er.attr('node', shape='oval', style='filled', fillcolor='white')
    
    # User attributes (underlined ID for primary key)
    er.node('User_ID', '<u>ID</u>')
    er.node('Username', 'Username')
    er.node('Email', 'Email')
    er.node('Password', 'Password_Hash')
    er.node('Full_Name', 'Full_Name')
    er.node('Role', 'Role')
    er.node('Institution', 'Institution')
    er.node('Bio', 'Bio')
    er.node('Profile_Image', 'Profile_Image')
    er.node('User_Created_At', 'Created_At')
    
    # Project attributes
    er.node('Project_ID', '<u>ID</u>')
    er.node('Project_Title', 'Title')
    er.node('Project_Desc', 'Description')
    er.node('Category', 'Category')
    er.node('Progress', 'Progress')
    er.node('Is_Private', 'Is_Private')
    er.node('Project_Created_At', 'Created_At')
    er.node('Repository_URL', 'Repository_URL')
    
    # Team attributes
    er.node('Team_ID', '<u>ID</u>')
    er.node('Team_Name', 'Name')
    er.node('Team_Desc', 'Description')
    er.node('Team_Created_At', 'Created_At')
    er.node('Visibility', 'Visibility')
    
    # Paper attributes
    er.node('Paper_ID', '<u>ID</u>')
    er.node('Paper_Title', 'Title')
    er.node('Paper_Abstract', 'Abstract')
    er.node('DOI', 'DOI')
    er.node('Publication_Date', 'Publication_Date')
    er.node('Paper_Created_At', 'Created_At')
    
    # Comment attributes
    er.node('Comment_ID', '<u>ID</u>')
    er.node('Content', 'Content')
    er.node('Comment_Created_At', 'Created_At')
    
    # Notification attributes
    er.node('Notification_ID', '<u>ID</u>')
    er.node('Type', 'Type')
    er.node('Message', 'Message')
    er.node('Is_Read', 'Is_Read')
    er.node('Notification_Created_At', 'Created_At')
    
    # TeamInvitation attributes
    er.node('Invitation_ID', '<u>ID</u>')
    er.node('Status', 'Status')
    er.node('Invitation_Created_At', 'Created_At')
    
    # Conference attributes
    er.node('Conference_ID', '<u>ID</u>')
    er.node('Conference_Name', 'Name')
    er.node('Conference_Desc', 'Description')
    er.node('Start_Date', 'Start_Date')
    er.node('End_Date', 'End_Date')
    er.node('Location', 'Location')
    er.node('Conference_Created_At', 'Created_At')
    er.node('Max_Participants', 'Max_Participants')
    er.node('Registration_Deadline', 'Registration_Deadline')
    
    # Registration attributes
    er.node('Registration_ID', '<u>ID</u>')
    er.node('Registration_Date', 'Registration_Date')
    er.node('Status', 'Status')
    er.node('Registration_Created_At', 'Created_At')
    
    # Edge styling for attributes
    er.attr('edge', dir='none')
    
    # Connect attributes to entities
    # User attributes
    for attr in ['User_ID', 'Username', 'Email', 'Password', 'Full_Name', 'Role', 
                'Institution', 'Bio', 'Profile_Image', 'User_Created_At']:
        er.edge('User', attr)
    
    # Project attributes
    for attr in ['Project_ID', 'Project_Title', 'Project_Desc', 'Category', 'Progress', 
                'Is_Private', 'Project_Created_At', 'Repository_URL']:
        er.edge('Project', attr)
    
    # Team attributes
    for attr in ['Team_ID', 'Team_Name', 'Team_Desc', 'Team_Created_At', 'Visibility']:
        er.edge('Team', attr)
    
    # Paper attributes
    for attr in ['Paper_ID', 'Paper_Title', 'Paper_Abstract', 'DOI', 
                'Publication_Date', 'Paper_Created_At']:
        er.edge('Paper', attr)
    
    # Comment attributes
    for attr in ['Comment_ID', 'Content', 'Comment_Created_At']:
        er.edge('Comment', attr)
    
    # Notification attributes
    for attr in ['Notification_ID', 'Type', 'Message', 'Is_Read', 'Notification_Created_At']:
        er.edge('Notification', attr)
    
    # TeamInvitation attributes
    for attr in ['Invitation_ID', 'Status', 'Invitation_Created_At']:
        er.edge('TeamInvitation', attr)
    
    # Conference attributes
    for attr in ['Conference_ID', 'Conference_Name', 'Conference_Desc', 'Start_Date', 
                'End_Date', 'Location', 'Conference_Created_At', 'Max_Participants', 
                'Registration_Deadline']:
        er.edge('Conference', attr)
    
    # Registration attributes
    for attr in ['Registration_ID', 'Registration_Date', 'Status', 'Registration_Created_At']:
        er.edge('Registration', attr)
    
    # Connect entities through relationships with cardinality
    # User-Project relationship
    er.edge('User', 'Works_On', label='N')
    er.edge('Works_On', 'Project', label='M')
    
    # User-Team relationship
    er.edge('User', 'Member_Of', label='N')
    er.edge('Member_Of', 'Team', label='M')
    
    # Team-Project relationship
    er.edge('Team', 'Manages', label='1')
    er.edge('Manages', 'Project', label='N')
    
    # User-Paper relationship
    er.edge('User', 'Authors', label='N')
    er.edge('Authors', 'Paper', label='M')
    
    # User-Comment relationship (on projects and papers)
    er.edge('User', 'Comments_On', label='1')
    er.edge('Comments_On', 'Comment', label='N')
    er.edge('Comment', 'Project', label='N')
    er.edge('Comment', 'Paper', label='N')
    
    # User-Notification relationship
    er.edge('User', 'Receives', label='1')
    er.edge('Receives', 'Notification', label='N')
    
    # Team-TeamInvitation-User relationship
    er.edge('Team', 'Invites', label='1')
    er.edge('Invites', 'TeamInvitation', label='N')
    er.edge('TeamInvitation', 'User', label='1')
    
    # Paper-Conference relationship
    er.edge('Paper', 'Presents_At', label='N')
    er.edge('Presents_At', 'Conference', label='1')
    
    # User-Conference relationship through Registration
    er.edge('User', 'Registers_For', label='1')
    er.edge('Registers_For', 'Registration', label='N')
    er.edge('Registration', 'Conference', label='1')

    # Graph styling
    er.attr(rankdir='TB')
    er.attr(splines='ortho')
    er.attr(nodesep='0.75')
    er.attr(ranksep='0.75')
    
    # Save the diagram with high DPI
    er.attr(dpi='300')
    er.render('er_diagram', view=True, format='png')

if __name__ == '__main__':
    generate_er_diagram() 