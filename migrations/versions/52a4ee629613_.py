"""empty message

Revision ID: 52a4ee629613
Revises: 3d59ce29b02a
Create Date: 2025-04-12 17:02:47.072770

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '52a4ee629613'
down_revision = '3d59ce29b02a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('reports', schema=None) as batch_op:
        batch_op.add_column(sa.Column('title', sa.String(length=255), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('reports', schema=None) as batch_op:
        batch_op.drop_column('title')

    # ### end Alembic commands ###
