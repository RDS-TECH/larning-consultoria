'use client'
import styled from 'styled-components'
import {
  FontBoldIcon,
  FontItalicIcon,
  StrikethroughIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  DividerVerticalIcon,
  ListBulletIcon,
  TableIcon,
  RowsIcon,
  ColumnsIcon,
  SectionIcon,
  ContainerIcon,
  ChevronDownIcon,
} from '@radix-ui/react-icons'
import { useTranslations } from 'next-intl'
import {
  AlertCircle,
  AlertTriangle,
  BadgeHelp,
  Code,
  Cuboid,
  FileText,
  ImagePlus,
  Link2,
  MousePointerClick,
  RotateCw,
  Sigma,
  Tags,
  User,
  Video,
  List,
  ListOrdered,
  Globe,
  GitBranch,
} from 'lucide-react'
import { SiYoutube } from '@icons-pack/react-simple-icons'
import ToolTip from '@components/Objects/StyledElements/Tooltip/Tooltip'
import React from 'react'
import LinkInputTooltip from './LinkInputTooltip'

export const ToolbarButtons = ({ editor, props }: any) => {
  const t = useTranslations('editor.toolbar')
  const [showTableMenu, setShowTableMenu] = React.useState(false)
  const [showListMenu, setShowListMenu] = React.useState(false)
  const [showLinkInput, setShowLinkInput] = React.useState(false)
  const linkButtonRef = React.useRef<HTMLDivElement>(null)

  if (!editor) {
    return null
  }


  const tableOptions = [
    {
      label: t('insertNewTable'),
      icon: <TableIcon />,
      action: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
    },
    {
      label: t('addRowBelow'),
      icon: <RowsIcon />,
      action: () => editor.chain().focus().addRowAfter().run()
    },
    {
      label: t('addColumnRight'),
      icon: <ColumnsIcon />,
      action: () => editor.chain().focus().addColumnAfter().run()
    },
    {
      label: t('deleteCurrentRow'),
      icon: <SectionIcon />,
      action: () => editor.chain().focus().deleteRow().run()
    },
    {
      label: t('deleteCurrentColumn'),
      icon: <ContainerIcon />,
      action: () => editor.chain().focus().deleteColumn().run()
    }
  ]

  const listOptions = [
    {
      label: t('bulletList'),
      icon: <List size={15} />,
      action: () => {
        if (editor.isActive('bulletList')) {
          editor.chain().focus().toggleBulletList().run()
        } else {
          editor.chain().focus().toggleOrderedList().run()
          editor.chain().focus().toggleBulletList().run()
        }
      }
    },
    {
      label: t('orderedList'),
      icon: <ListOrdered size={15} />,
      action: () => {
        if (editor.isActive('orderedList')) {
          editor.chain().focus().toggleOrderedList().run()
        } else {
          editor.chain().focus().toggleBulletList().run()
          editor.chain().focus().toggleOrderedList().run()
        }
      }
    }
  ]

  const handleLinkClick = () => {
    // Store the current selection
    const { from, to } = editor.state.selection
    
    if (editor.isActive('link')) {
      const currentLink = editor.getAttributes('link')
      setShowLinkInput(true)
    } else {
      setShowLinkInput(true)
    }

    // Restore the selection after a small delay to ensure the tooltip is rendered
    setTimeout(() => {
      editor.commands.setTextSelection({ from, to })
    }, 0)
  }

  const getCurrentLinkUrl = () => {
    if (editor.isActive('link')) {
      return editor.getAttributes('link').href
    }
    return ''
  }

  const handleLinkSave = (url: string) => {
    editor
      .chain()
      .focus()
      .setLink({ 
        href: url,
        target: '_blank',
        rel: 'noopener noreferrer'
      })
      .run()
    setShowLinkInput(false)
  }

  const handleLinkCancel = () => {
    setShowLinkInput(false)
  }

  return (
    <ToolButtonsWrapper>
      <ToolBtn onClick={() => editor.chain().focus().undo().run()} aria-label={t('undo')}>
        <ArrowLeftIcon />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().redo().run()} aria-label={t('redo')}>
        <ArrowRightIcon />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
        aria-label={t('bold')}
      >
        <FontBoldIcon />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
        aria-label={t('italic')}
      >
        <FontItalicIcon />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
        aria-label={t('strikethrough')}
      >
        <StrikethroughIcon />
      </ToolBtn>
      <ListMenuWrapper>
        <ToolBtn
          onClick={() => setShowListMenu(!showListMenu)}
          className={showListMenu || editor.isActive('bulletList') || editor.isActive('orderedList') ? 'is-active' : ''}
          aria-label={t('list')}
        >
          <ListBulletIcon />
          <ChevronDownIcon />
        </ToolBtn>
        {showListMenu && (
          <ListDropdown>
            {listOptions.map((option, index) => (
              <ListMenuItem 
                key={index}
                onClick={() => {
                  option.action()
                  setShowListMenu(false)
                }}
                className={editor.isActive(option.label === 'Bullet List' ? 'bulletList' : 'orderedList') ? 'is-active' : ''}
              >
                <span className="icon">{option.icon}</span>
                <span className="label">{option.label}</span>
              </ListMenuItem>
            ))}
          </ListDropdown>
        )}
      </ListMenuWrapper>
      <ToolSelect
        value={
          editor.isActive('heading', { level: 1 }) ? "1" :
          editor.isActive('heading', { level: 2 }) ? "2" :
          editor.isActive('heading', { level: 3 }) ? "3" :
          editor.isActive('heading', { level: 4 }) ? "4" :
          editor.isActive('heading', { level: 5 }) ? "5" :
          editor.isActive('heading', { level: 6 }) ? "6" : "0"
        }
        onChange={(e) => {
          const value = e.target.value;
          if (value === "0") {
            editor.chain().focus().setParagraph().run();
          } else {
            editor.chain().focus().toggleHeading({ level: parseInt(value) }).run();
          }
        }}
      >
        <option value="0">{t('paragraph')}</option>
        <option value="1">{t('heading1')}</option>
        <option value="2">{t('heading2')}</option>
        <option value="3">{t('heading3')}</option>
        <option value="4">{t('heading4')}</option>
        <option value="5">{t('heading5')}</option>
        <option value="6">{t('heading6')}</option>
      </ToolSelect>
      <TableMenuWrapper>
        <ToolBtn
          onClick={() => setShowTableMenu(!showTableMenu)}
          className={showTableMenu ? 'is-active' : ''}
          aria-label={t('table')}
        >
          <TableIcon width={18} />
          <ChevronDownIcon  />
        </ToolBtn>
        {showTableMenu && (
          <TableDropdown>
            {tableOptions.map((option, index) => (
              <TableMenuItem 
                key={index}
                onClick={() => {
                  option.action()
                  setShowTableMenu(false)
                }}
              >
                <span className="icon">{option.icon}</span>
                <span className="label">{option.label}</span>
              </TableMenuItem>
            ))}
          </TableDropdown>
        )}
      </TableMenuWrapper>
      <DividerVerticalIcon
        style={{ marginTop: 'auto', marginBottom: 'auto', color: 'grey' }}
      />
      <ToolTip content={t('infoCallout')}>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleNode('calloutInfo').run()}
          aria-label={t('infoCallout')}
        >
          <AlertCircle size={15} />
        </ToolBtn>
      </ToolTip>
      <ToolTip content={t('warningCallout')}>
        <ToolBtn
          onClick={() =>
            editor.chain().focus().toggleNode('calloutWarning').run()
          }
          aria-label={t('warningCallout')}
        >
          <AlertTriangle size={15} />
        </ToolBtn>
      </ToolTip>
      <ToolTip content={t('link')}>
        <div style={{ position: 'relative' }}>
          <ToolBtn
            ref={linkButtonRef}
            onClick={handleLinkClick}
            className={editor.isActive('link') ? 'is-active' : ''}
            aria-label={t('link')}
          >
            <Link2 size={15} />
          </ToolBtn>
          {showLinkInput && (
            <LinkInputTooltip
              onSave={handleLinkSave}
              onCancel={handleLinkCancel}
              currentUrl={getCurrentLinkUrl()}
            />
          )}
        </div>
      </ToolTip>
      <ToolTip content={t('image')}>
        <ToolBtn
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertContent({
                type: 'blockImage',
              })
              .run()
          }
          aria-label={t('image')}
        >
          <ImagePlus size={15} />
        </ToolBtn>
      </ToolTip>
      <ToolTip content={t('video')}>
        <ToolBtn
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertContent({
                type: 'blockVideo',
              })
              .run()
          }
          aria-label={t('video')}
        >
          <Video size={15} />
        </ToolBtn>
      </ToolTip>
      <ToolTip content={t('youtube')}>
        <ToolBtn onClick={() => editor.chain().focus().insertContent({ type: 'blockEmbed' }).run()} aria-label={t('youtube')}>
          <SiYoutube size={15} />
        </ToolBtn>
      </ToolTip>
      <ToolTip content={t('mathEquation')}>
        <ToolBtn
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertContent({
                type: 'blockMathEquation',
              })
              .run()
          }
          aria-label={t('mathEquation')}
        >
          <Sigma size={15} />
        </ToolBtn>
      </ToolTip>
      <ToolTip content={t('pdf')}>
        <ToolBtn
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertContent({
                type: 'blockPDF',
              })
              .run()
          }
          aria-label={t('pdf')}
        >
          <FileText size={15} />
        </ToolBtn>
      </ToolTip>
      <ToolTip content={t('quiz')}>
        <ToolBtn
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertContent({
                type: 'blockQuiz',
              })
              .run()
          }
          aria-label={t('quiz')}
        >
          <BadgeHelp size={15} />
        </ToolBtn>
      </ToolTip>
      <ToolTip content={t('codeBlock')}>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'is-active' : ''}
          aria-label={t('codeBlock')}
        >
          <Code size={15} />
        </ToolBtn>
      </ToolTip>
      <ToolTip content={t('embed')}>
        <ToolBtn
          onClick={() => editor.chain().focus().insertContent({ type: 'blockEmbed' }).run()}
          aria-label={t('embed')}
        >
          <Cuboid size={15} />
        </ToolBtn>
      </ToolTip>
      <ToolTip content={t('badges')}>
        <ToolBtn
          onClick={() => editor.chain().focus().insertContent({
            type: 'badge',
            content: [
              {
                type: 'text',
                text: 'This is a Badge'
              }
            ]
          }).run()}
          aria-label={t('badges')}
        >
          <Tags size={15} />
        </ToolBtn>
      </ToolTip>
      <ToolTip content={t('button')}>
        <ToolBtn
          onClick={() => editor.chain().focus().insertContent({
            type: 'button',
            content: [
              {
                type: 'text',
                text: 'Click me'
              }
            ]
          }).run()}
          aria-label={t('button')}
        >
          <MousePointerClick size={15} />
        </ToolBtn>
      </ToolTip>
      <ToolTip content={t('user')}>
        <ToolBtn
          onClick={() => editor.chain().focus().insertContent({ type: 'blockUser' }).run()}
          aria-label={t('user')}
        >
          <User size={15} />
        </ToolBtn>
      </ToolTip>
      <ToolTip content={t('webPreview')}>
        <ToolBtn
          onClick={() =>
            editor.chain().focus().insertContent({
              type: 'blockWebPreview',
            }).run()
          }
          aria-label={t('webPreview')}
        >
          <Globe size={15} />
        </ToolBtn>
      </ToolTip>
      <ToolTip content={t('flipcard')}>
        <ToolBtn
          onClick={() =>
            editor.chain().focus().insertContent({
              type: 'flipcard',
              attrs: {
                question: 'Click to reveal the answer',
                answer: 'This is the answer',
                color: 'blue',
                alignment: 'center',
                size: 'medium'
              }
            }).run()
          }
          aria-label={t('flipcard')}
        >
          <RotateCw size={15} />
        </ToolBtn>
      </ToolTip>
      <ToolTip content={t('interactiveScenarios')}>
        <ToolBtn
          onClick={() =>
            editor.chain().focus().insertContent({
              type: 'scenarios',
              attrs: {
                title: 'Interactive Scenario',
                scenarios: [
                  {
                    id: '1',
                    text: 'Welcome to this interactive scenario. What would you like to do?',
                    imageUrl: '',
                    options: [
                      { id: 'opt1', text: 'Continue exploring', nextScenarioId: '2' },
                      { id: 'opt2', text: 'Learn more about the topic', nextScenarioId: '3' }
                    ]
                  },
                  {
                    id: '2',
                    text: 'Great choice! You are now exploring further. What\'s your next step?',
                    imageUrl: '',
                    options: [
                      { id: 'opt3', text: 'Go back to start', nextScenarioId: '1' },
                      { id: 'opt4', text: 'Finish scenario', nextScenarioId: null }
                    ]
                  },
                  {
                    id: '3',
                    text: 'Here\'s more information about the topic. This helps you understand better.',
                    imageUrl: '',
                    options: [
                      { id: 'opt5', text: 'Go back to start', nextScenarioId: '1' },
                      { id: 'opt6', text: 'Finish scenario', nextScenarioId: null }
                    ]
                  }
                ],
                currentScenarioId: '1'
              }
            }).run()
          }
          aria-label={t('interactiveScenarios')}
        >
          <GitBranch size={15} />
        </ToolBtn>
      </ToolTip>
    </ToolButtonsWrapper>
  )
}

const ToolButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: left;
  justify-content: left;
`

const ToolBtn = styled.div`
  display: flex;
  background: rgba(217, 217, 217, 0.24);
  border-radius: 6px;
  min-width: 25px;
  height: 25px;
  padding: 5px;
  margin-right: 5px;
  transition: all 0.2s ease-in-out;

  svg {
    padding: 1px;
  }

  &.is-active {
    background: rgba(176, 176, 176, 0.5);

    &:hover {
      background: rgba(139, 139, 139, 0.5);
      cursor: pointer;
    }
  }

  &:hover {
    background: rgba(217, 217, 217, 0.48);
    cursor: pointer;
  }
`

const ToolSelect = styled.select`
  display: flex;
  background: rgba(217, 217, 217, 0.185);
  border-radius: 6px;
  width: 120px;
  border: none;
  height: 25px;
  padding: 2px 5px;
  font-size: 11px;
  font-family: 'DM Sans';
  margin-right: 5px;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 5px center;
  background-size: 12px;
  padding-right: 20px;

  &:hover {
    background-color: rgba(217, 217, 217, 0.3);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(217, 217, 217, 0.5);
  }
`

const TableMenuWrapper = styled.div`
  position: relative;
  display: inline-block;
`

const TableDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid rgba(217, 217, 217, 0.5);
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 180px;
  margin-top: 4px;
`

const TableMenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(217, 217, 217, 0.24);
  }

  .icon {
    margin-right: 8px;
    display: flex;
    align-items: center;
  }

  .label {
    font-size: 12px;
    font-family: 'DM Sans';
  }
`

const ListMenuWrapper = styled.div`
  position: relative;
  display: inline-block;
`

const ListDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid rgba(217, 217, 217, 0.5);
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 180px;
  margin-top: 4px;
`

const ListMenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(217, 217, 217, 0.24);
  }

  &.is-active {
    background: rgba(176, 176, 176, 0.5);
  }

  .icon {
    margin-right: 8px;
    display: flex;
    align-items: center;
  }

  .label {
    font-size: 12px;
    font-family: 'DM Sans';
  }
`