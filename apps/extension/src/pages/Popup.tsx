import { useSelector } from 'react-redux'
import type { RootState } from '../store'
import { API_BASE_URL } from '@/config/api'
import PopupHeader from '@/components/popup/PopupHeader'
import PopupMain from '@/components/popup/PopupMain'
import PopupFooter from '@/components/popup/PopupFooter'
import PopupLoadingView from '@/components/popup/PopupLoadingView'
import PopupUnsupportedView from '@/components/popup/PopupUnsupportedView'
import { useUIEffect } from '@/hooks/useUIEffect'
import { usePopupController } from '@/hooks/usePopupController'

const Popup: React.FC = () => {
  useUIEffect()

  const uiState = useSelector((state: RootState) => state.ui)
  const popup = usePopupController()

  const openWebsiteIntegrations = () => {
    chrome.tabs.create({ url: `${API_BASE_URL}/settings/integrations` })
  }

  return (
    <div
      className={`flex flex-col w-[380px] h-[580px] ${uiState.fontSize} bg-[var(--bg-popover)] text-[var(--text-main)] overflow-hidden transition-all duration-500`}
    >
      <PopupHeader />
      {popup.pageMode === 'loading' ? (
        <PopupLoadingView />
      ) : popup.pageMode === 'unsupported' ? (
        <PopupUnsupportedView
          pageTitle={popup.pageTitle}
          pageUrl={popup.pageUrl}
          popupError={popup.popupError}
          onOpenWebsiteIntegrations={openWebsiteIntegrations}
        />
      ) : (
        <>
          <PopupMain
            properties={popup.properties}
            setProperties={popup.setProperties}
            propertyList={popup.propertyList}
            onAddProperty={popup.addProperty}
          />
          <PopupFooter
            target={popup.target}
            setTarget={popup.setTarget}
            notionStatus={popup.notionStatus}
            googleDriveStatus={popup.googleDriveStatus}
            oneDriveStatus={popup.oneDriveStatus}
            dropboxStatus={popup.dropboxStatus}
            isConfigured={popup.isConfigured}
            isSaving={popup.isSaving}
            isSaved={popup.isSaved}
            handleSave={popup.handleSave}
            selectedVault={popup.selectedVault}
            setSelectedVault={popup.setSelectedVault}
            selectedFolder={popup.selectedFolder}
            setSelectedFolder={popup.setSelectedFolder}
            popupError={popup.popupError}
          />
        </>
      )}
    </div>
  )
}

export default Popup

